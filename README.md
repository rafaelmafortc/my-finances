# Arquitetura do Projeto

Este documento descreve a arquitetura genérica do projeto para orientar o desenvolvimento e garantir consistência ao trabalhar com IA assistida.

## Visão Geral

Este projeto segue uma **arquitetura baseada em features** (Feature-Based Architecture), onde o código é organizado por domínios de funcionalidade ao invés de por tipo de arquivo. Isso facilita a manutenção, escalabilidade e reutilização de código.

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
│   └── charts/          # Componentes de gráficos (exemplo)
├── lib/                  # Utilitários e helpers compartilhados
├── hooks/                # React hooks customizados
└── providers/            # Context providers do React
```

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
- Retornar dados ou lançar erros (não retornar objetos de erro)
- Usar `revalidatePath()` quando necessário para invalidar cache

```typescript
// src/features/[feature]/actions/[action-name].ts
'use server';

import { revalidatePath } from 'next/cache';

export async function create[Entity](data: CreateInput) {
  // Validação
  if (!data.name?.trim()) {
    throw new Error('Nome é obrigatório');
  }

  // Lógica de negócio
  const result = await prisma.entity.create({ data });

  // Revalidação
  revalidatePath('/[route]');

  return result;
}
```

### 4. Componentes

Componentes devem:

- Estar em `features/[feature]/components/`
- Ser nomeados em PascalCase
- Usar `'use client'` quando necessário (interatividade, hooks, eventos)
- Importar actions e tipos da própria feature via barrel export

```typescript
// src/features/[feature]/components/[component-name].tsx
'use client';

import { create[Entity], type [Entity] } from '@/features/[feature]';
import { toast } from 'sonner';

export function [ComponentName]({ data }: Props) {
  // Implementação
}
```

### 5. Tratamento de Erros

**Padrão de tratamento de erros:**

- **Server Actions**: Lançam erros com mensagens descritivas
- **Client Components**: Capturam erros e exibem via toast (apenas erros, não sucessos)
- **Não retornar objetos de erro**: Server Actions devem lançar exceções

```typescript
// Em componentes client
try {
  await createEntity(data);
  // Sucesso: apenas fechar diálogo/atualizar UI, SEM toast
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : 'Erro ao salvar';
  toast.error(errorMessage);
  // Opcional: também mostrar erro no formulário
  setError(errorMessage);
}
```

### 6. Importações

**Regras de importação:**

1. **Entre features**: Use barrel exports via `@/features/[feature-name]`
2. **Componentes UI**: Use `@/components/ui/[component-name]`
3. **Utilitários**: Use `@/lib/[util-name]`
4. **Hooks**: Use `@/hooks/[hook-name]`
5. **Evite imports relativos profundos**: Prefira aliases `@/`

```typescript
// ✅ Correto
import { createEntity, type Entity } from '@/features/entities';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ❌ Evite
import { createEntity } from '../../../features/entities/actions/entity';
```

### 7. Tipos TypeScript

Tipos devem:

- Estar em `features/[feature]/types/[feature-name].ts`
- Ser exportados via barrel export
- Usar nomes descritivos e consistentes
- Evitar tipos genéricos demais

```typescript
// src/features/[feature]/types/[feature-name].ts
export type [Entity] = {
  id: string;
  name: string;
  // ...
};

export type Create[Entity]Input = {
  name: string;
  // ...
};
```

## Padrões de Desenvolvimento

### Criando uma Nova Feature

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

2. **Definir tipos primeiro:**

   ```typescript
   // types/[feature-name].ts
   export type Entity = { ... };
   ```

3. **Criar Server Actions:**

   ```typescript
   // actions/[feature-name].ts
   'use server';
   export async function createEntity() { ... }
   ```

4. **Criar componentes:**

   ```typescript
   // components/[component-name].tsx
   'use client';
   import { createEntity } from '@/features/[feature-name]';
   ```

5. **Exportar via barrel:**
   ```typescript
   // index.ts
   export * from './actions/[feature-name]';
   export * from './components/[component-name]';
   export * from './types/[feature-name]';
   ```

### Reutilização de Código

**Quando criar componente compartilhado:**

- ✅ Componente usado em 2+ features diferentes → `components/ui/` ou `components/[category]/`
- ✅ Componente usado apenas em uma feature → `features/[feature]/components/`
- ✅ Lógica reutilizável → `lib/[util-name].ts`
- ✅ Hook reutilizável → `hooks/[hook-name].ts`

**Quando criar Server Action compartilhada:**

- ✅ Ação específica de uma feature → `features/[feature]/actions/`
- ✅ Ação usada por múltiplas features → Avaliar se deve ser uma feature separada ou utilitário

### Convenções de Nomenclatura

- **Features**: `kebab-case` (ex: `user-profile`, `order-management`)
- **Componentes**: `PascalCase` (ex: `UserProfileForm`, `OrderTable`)
- **Server Actions**: `camelCase` com verbo (ex: `createUser`, `updateOrder`, `deleteItem`)
- **Tipos**: `PascalCase` (ex: `User`, `CreateUserInput`, `UpdateUserInput`)
- **Arquivos de componentes**: `kebab-case.tsx` (ex: `user-profile-form.tsx`)
- **Arquivos de actions**: `kebab-case.ts` (ex: `user.ts`)
- **Arquivos de tipos**: `kebab-case.ts` (ex: `user.ts`)

## Fluxo de Dados

```
Page (Server Component)
  ↓
  Importa Server Actions e busca dados
  ↓
  Passa dados para Client Components
  ↓
Client Components
  ↓
  Chamam Server Actions via eventos
  ↓
Server Actions
  ↓
  Validam, processam, salvam
  ↓
  Revalidam paths e retornam
  ↓
Client Components
  ↓
  Atualizam UI (router.refresh() se necessário)
```

## Diretrizes para IA

Ao trabalhar com IA assistida, siga estas diretrizes:

1. **Sempre use barrel exports**: Importe de `@/features/[feature]`, não de arquivos específicos
2. **Mantenha features isoladas**: Evite dependências circulares entre features
3. **Server Actions são assíncronas**: Sempre use `await` e trate erros
4. **Componentes client precisam 'use client'**: Qualquer interatividade requer isso
5. **Erros apenas no toast**: Não mostre mensagens de sucesso, apenas erros
6. **Revalide paths após mutations**: Use `revalidatePath()` após criar/atualizar/deletar
7. **Tipos primeiro**: Defina tipos antes de criar actions e components
8. **Nomenclatura consistente**: Siga as convenções estabelecidas

## Exemplo Completo

### Estrutura

```
features/products/
├── actions/
│   └── product.ts          # createProduct, updateProduct, deleteProduct
├── components/
│   ├── product-table.tsx   # Lista de produtos
│   └── product-dialog.tsx  # Formulário de criar/editar
├── types/
│   └── product.ts          # Product, CreateProductInput, etc.
└── index.ts               # Exporta tudo
```

### Uso em uma página

```typescript
// app/products/page.tsx
import { ProductTable, getProducts } from '@/features/products';

export default async function Page() {
  const products = await getProducts();
  return <ProductTable products={products} />;
}
```

### Uso em componente

```typescript
// features/products/components/product-dialog.tsx
'use client';
import { toast } from 'sonner';

import {
  type Product,
  createProduct,
  updateProduct,
} from '@/features/products';

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

## Benefícios desta Arquitetura

1. **Manutenibilidade**: Código relacionado fica junto
2. **Escalabilidade**: Fácil adicionar novas features sem afetar existentes
3. **Testabilidade**: Features isoladas são mais fáceis de testar
4. **Colaboração**: Múltiplos desenvolvedores podem trabalhar em features diferentes
5. **Reutilização**: Barrel exports facilitam importações limpas
6. **Clareza**: Estrutura de pastas reflete a estrutura do domínio

---

**Nota**: Este documento é genérico e pode ser adaptado para diferentes projetos seguindo o mesmo padrão arquitetural.
