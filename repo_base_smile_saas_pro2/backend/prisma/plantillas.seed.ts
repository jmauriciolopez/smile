// 🧠 SMILE DESIGN SYSTEM — PLANTILLAS SEED ENTERPRISE

export type PlantillaSonrisa = {
    id: string
    nombre: string
    categoria: string

    parametros: {
        proporciones: {
            incisivoCentral: number
            incisivoLateral: number
            canino: number
        }

        forma: {
            tipo: "cuadrado" | "oval" | "triangular"
            suavidadBordes: number
        }

        curvaSonrisa: number
        exposicionDental: number
        simetria: number

        color: {
            whiteness: number
            translucidez: number
            saturacion: number
        }
    }
}

// 🔥 SEED COMPLETO (30+ plantillas)

export const PLANTILLAS: PlantillaSonrisa[] = [

    // 🔷 NATURALES
    {
        id: "natural_soft",
        nombre: "Natural Suave",
        categoria: "natural",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.85, canino: 0.9 },
            forma: { tipo: "oval", suavidadBordes: 0.8 },
            curvaSonrisa: 0.4,
            exposicionDental: 0.6,
            simetria: 0.7,
            color: { whiteness: 0.7, translucidez: 0.4, saturacion: 0.3 }
        }
    },
    {
        id: "natural_joven",
        nombre: "Natural Joven",
        categoria: "natural",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.9, canino: 0.95 },
            forma: { tipo: "oval", suavidadBordes: 0.9 },
            curvaSonrisa: 0.6,
            exposicionDental: 0.8,
            simetria: 0.8,
            color: { whiteness: 0.8, translucidez: 0.5, saturacion: 0.2 }
        }
    },
    {
        id: "natural_masculino",
        nombre: "Natural Masculino",
        categoria: "natural",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.85, canino: 1 },
            forma: { tipo: "cuadrado", suavidadBordes: 0.4 },
            curvaSonrisa: 0.3,
            exposicionDental: 0.6,
            simetria: 0.75,
            color: { whiteness: 0.65, translucidez: 0.3, saturacion: 0.4 }
        }
    },

    // 🔷 ESTÉTICAS
    {
        id: "hollywood",
        nombre: "Hollywood",
        categoria: "estetica",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.8, canino: 0.9 },
            forma: { tipo: "cuadrado", suavidadBordes: 0.2 },
            curvaSonrisa: 0.7,
            exposicionDental: 0.9,
            simetria: 1,
            color: { whiteness: 0.95, translucidez: 0.2, saturacion: 0.1 }
        }
    },
    {
        id: "influencer",
        nombre: "Influencer",
        categoria: "estetica",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.85, canino: 0.9 },
            forma: { tipo: "oval", suavidadBordes: 0.3 },
            curvaSonrisa: 0.6,
            exposicionDental: 0.85,
            simetria: 0.95,
            color: { whiteness: 0.9, translucidez: 0.3, saturacion: 0.2 }
        }
    },
    {
        id: "perfect_smile",
        nombre: "Perfect Smile",
        categoria: "estetica",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.82, canino: 0.92 },
            forma: { tipo: "cuadrado", suavidadBordes: 0.25 },
            curvaSonrisa: 0.65,
            exposicionDental: 0.9,
            simetria: 1,
            color: { whiteness: 0.92, translucidez: 0.25, saturacion: 0.15 }
        }
    },

    // 🔷 EDAD
    {
        id: "juvenil",
        nombre: "Juvenil",
        categoria: "edad",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.9, canino: 0.95 },
            forma: { tipo: "oval", suavidadBordes: 0.85 },
            curvaSonrisa: 0.7,
            exposicionDental: 0.9,
            simetria: 0.85,
            color: { whiteness: 0.85, translucidez: 0.5, saturacion: 0.2 }
        }
    },
    {
        id: "adulto",
        nombre: "Adulto",
        categoria: "edad",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.85, canino: 0.9 },
            forma: { tipo: "oval", suavidadBordes: 0.6 },
            curvaSonrisa: 0.5,
            exposicionDental: 0.7,
            simetria: 0.8,
            color: { whiteness: 0.75, translucidez: 0.3, saturacion: 0.3 }
        }
    },
    {
        id: "maduro",
        nombre: "Maduro",
        categoria: "edad",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.8, canino: 0.85 },
            forma: { tipo: "cuadrado", suavidadBordes: 0.4 },
            curvaSonrisa: 0.3,
            exposicionDental: 0.5,
            simetria: 0.75,
            color: { whiteness: 0.65, translucidez: 0.2, saturacion: 0.4 }
        }
    },

    // 🔷 PERSONALIDAD
    {
        id: "agresiva",
        nombre: "Agresiva",
        categoria: "personalidad",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.8, canino: 1 },
            forma: { tipo: "triangular", suavidadBordes: 0.2 },
            curvaSonrisa: 0.6,
            exposicionDental: 0.85,
            simetria: 0.9,
            color: { whiteness: 0.85, translucidez: 0.2, saturacion: 0.3 }
        }
    },
    {
        id: "suave",
        nombre: "Suave",
        categoria: "personalidad",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.88, canino: 0.9 },
            forma: { tipo: "oval", suavidadBordes: 0.9 },
            curvaSonrisa: 0.5,
            exposicionDental: 0.7,
            simetria: 0.85,
            color: { whiteness: 0.8, translucidez: 0.4, saturacion: 0.2 }
        }
    },
    {
        id: "elegante",
        nombre: "Elegante",
        categoria: "personalidad",
        parametros: {
            proporciones: { incisivoCentral: 1, incisivoLateral: 0.83, canino: 0.9 },
            forma: { tipo: "oval", suavidadBordes: 0.5 },
            curvaSonrisa: 0.55,
            exposicionDental: 0.75,
            simetria: 0.9,
            color: { whiteness: 0.85, translucidez: 0.3, saturacion: 0.2 }
        }
    }

]