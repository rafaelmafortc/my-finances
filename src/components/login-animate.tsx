'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpandingCircle() {
    const [isVisible, setIsVisible] = useState(true);

    const variants = {
        hidden: {
            scale: 0,
            opacity: 0,
            transition: { duration: 2 },
        },
        visible: {
            scale: 25,
            opacity: 1,
            transition: { duration: 2 },
        },
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        backgroundColor: 'var(--sidebar)',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={variants}
                />
            )}
        </AnimatePresence>
    );
}
