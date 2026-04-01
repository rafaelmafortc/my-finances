# Arquitetura e Regras de Desenvolvimento

Este documento descreve a arquitetura do projeto e as regras que devem ser seguidas ao desenvolver novas funcionalidades — especialmente relevante para agentes de IA trabalhando de forma autônoma.

## Visão Geral

O projeto segue uma **arquitetura baseada em features** (Feature-Based Architecture), onde o código é organizado por domínios de funcionalidade ao invés de por tipo de arquivo. Isso facilita manutenção, escalabilidade e reutilização de código.

## Estrutura de Diretórios

```
src/
├── app/                    # Next.js App Router (rotas e layouts)
│   ├── (app)/             # Grupo de rotas autenticadas
│   ├── (auth)/            # Grupo de rotas de autenticação
│   └── api/               # API routes (quando necessário)
├── features/              # Módulos de funcionalidades (DOMÍNIO PRINCIPAL)
│   └── [feature-name]/
│       ├── actions/       # Server Actions (lógica de servidor)
│       ├── components/    # Componentes específicos da feature
│       ├── types/         # Tipos TypeScript específicos
│       └── index.ts       # Barrel export (exportações públicas)
├── components/            # Componentes compartilhados
│   ├── ui/               # Componentes de UI reutilizáveis
│   ├── layout/           # Componentes de layout
│   └── charts/           # Componentes de gráficos
├── lib/                  # Utilitários e helpers compartilhados
├── hooks/                # React hooks customizados
└── providers/            # Context providers do React
```

---

## Princípios da Arquitetura

### 1. Features como Módulos Independentes

Cada feature é um módulo autocontido que agrupa:

- **Actions**: Server Actions do Next.js para operações no servidor
- **Components**: Componentes React específicos da feature
- **Types**: Definições TypeScript relacionadas
- **index.ts**: Ponto de entrada público da feature

### 2. Barrel Exports (index.ts)

Cada feature deve ter um `index.ts` que exporta tudo que é público:

```typescript
// src/features/[feature-name]/index.ts
export * from './actions/[feature-name]';
export * from './components/[component-name]';
export * from './types/[feature-name]';
```

**Regra**: Apenas exporte o que outras features ou páginas precisam usar. Componentes internos não devem ser exportados.

### 3. Server Actions

Server Actions devem:

- Estar em arquivos com `'use server'` no topo
- Ser organizadas por feature em `features/[feature]/actions/`
- Retornar dados ou lançar erros (nunca retornar objetos de erro)
- Usar `revalidatePath()` após criar/atualizar/deletar dados

```typescript
// src/features/[feature]/actions/[action-name].ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createEntity(data: CreateInput) {
  if (!data.name?.trim()) {
    throw new Error('Nome é obrigatório');
  }

  const result = await prisma.entity.create({ data });

  revalidatePath('/[route]');

  return result;
}
```

### 4. Componentes

Componentes devem:

- Estar em `features/[feature]/components/`
- Ser nomeados em PascalCase
- Usar `'use client'` quando necessário (interatividade, hooks, eventos)
- Importar actions e tipos via barrel export da própria feature

```typescript
// src/features/[feature]/components/[component-name].tsx
'use client';

import { createEntity, type Entity } from '@/features/[feature]';
import { toast } from 'sonner';

export function ComponentName({ data }: Props) {
  // implementação
}
```

### 5. Tratamento de Erros

- **Server Actions**: lançam erros com `throw new Error('mensagem descritiva')`
- **Client Components**: capturam erros e exibem via `toast.error()`
- **Não mostre toast de sucesso** — apenas erros são notificados

```typescript
try {
  await createEntity(data);
  // Sucesso: fechar diálogo ou atualizar UI, SEM toast
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : 'Erro ao salvar';
  toast.error(errorMessage);
}
```

### 6. Regras de Importação

1. **Entre features**: use barrel exports via `@/features/[feature-name]`
2. **Componentes UI**: use `@/components/ui/[component-name]`
3. **Utilitários**: use `@/lib/[util-name]`
4. **Hooks**: use `@/hooks/[hook-name]`
5. **Evite imports relativos profundos**: prefira sempre o alias `@/`

```typescript
// ✅ Correto
import { createEntity, type Entity } from '@/features/entities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ❌ Evite
import { createEntity } from '../../../features/entities/actions/entity';
```

### 7. Tipos TypeScript

- Definir tipos **antes** de criar actions e components
- Estar em `features/[feature]/types/[feature-name].ts`
- Exportados via barrel export
- Nomes descritivos e consistentes

```typescript
export type Entity = {
  id: string;
  name: string;
};

export type CreateEntityInput = {
  name: string;
};
```

---

## Fluxo de Dados

```
Page (Server Component)
  ↓ importa Server Actions e busca dados
  ↓ passa dados para Client Components
Client Components
  ↓ chamam Server Actions via eventos
Server Actions
  ↓ validam, processam, salvam
  ↓ revalidam paths e retornam
Client Components
  ↓ atualizam UI (router.refresh() se necessário)
```

---

## Criando uma Nova Feature

1. **Criar estrutura de pastas:**

   ```
   src/features/[feature-name]/
   ├── actions/
   │   └── [feature-name].ts
   ├── components/
   │   └── [component-name].tsx
   ├── types/
   │   └── [feature-name].ts
   └── index.ts
   ```

2. **Definir tipos primeiro** (`types/[feature-name].ts`)

3. **Criar Server Actions** (`actions/[feature-name].ts`)

4. **Criar componentes** (`components/[component-name].tsx`)

5. **Exportar via barrel** (`index.ts`)

---

## Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Pastas de features | `kebab-case` | `user-profile` |
| Componentes | `PascalCase` | `UserProfileForm` |
| Server Actions | `camelCase` com verbo | `createUser`, `deleteItem` |
| Tipos | `PascalCase` | `User`, `CreateUserInput` |
| Arquivos de componentes | `kebab-case.tsx` | `user-profile-form.tsx` |
| Arquivos de actions | `kebab-case.ts` | `user.ts` |
| Arquivos de tipos | `kebab-case.ts` | `user.ts` |

---

## Reutilização de Código

| Situação | Destino |
|---|---|
| Componente usado em 2+ features | `components/ui/` ou `components/[category]/` |
| Componente usado só em uma feature | `features/[feature]/components/` |
| Lógica reutilizável | `lib/[util-name].ts` |
| Hook reutilizável | `hooks/[hook-name].ts` |
| Action específica de uma feature | `features/[feature]/actions/` |

---

## Diretrizes para Agentes de IA

Ao trabalhar de forma autônoma neste projeto, siga estritamente:

1. **Sempre use barrel exports** — importe de `@/features/[feature]`, nunca de arquivos internos diretamente
2. **Mantenha features isoladas** — evite dependências circulares entre features
3. **Server Actions são sempre assíncronas** — use `await` e trate todos os erros
4. **Componentes com interatividade precisam de `'use client'`** — hooks, eventos, estado
5. **Apenas toast de erro** — nunca mostre toast de sucesso
6. **Revalide paths após mutations** — `revalidatePath()` após criar, atualizar ou deletar
7. **Tipos antes de tudo** — defina tipos antes de criar actions e componentes
8. **Siga as convenções de nomenclatura** sem exceções

---

## Exemplo Completo

### Estrutura

```
features/products/
├── actions/
│   └── product.ts          # createProduct, updateProduct, deleteProduct
├── components/
│   ├── product-table.tsx
│   └── product-dialog.tsx
├── types/
│   └── product.ts
└── index.ts
```

### Página (Server Component)

```typescript
// app/(app)/products/page.tsx
import { ProductTable, getProducts } from '@/features/products';

export default async function Page() {
  const products = await getProducts();
  return <ProductTable products={products} />;
}
```

### Componente (Client Component)

```typescript
// features/products/components/product-dialog.tsx
'use client';

import { toast } from 'sonner';
import { type Product, createProduct, updateProduct } from '@/features/products';

export function ProductDialog({ product }: { product?: Product }) {
  const handleSubmit = async (data: FormData) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
      // Sucesso: fechar diálogo, sem toast
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar');
    }
  };
}
```
