export interface Product {
    id: number;
    nom: string;
    description: string;
    prix: number;
    categorie_id: string;
    categorie_nom: string;
    image: string | File| null; // L'image binaire sera convertie en Base64
  }