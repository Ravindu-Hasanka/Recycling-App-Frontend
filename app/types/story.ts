export type Story = {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  numberOfStages: number;
  isActive: boolean;

  plastic: number;
  glass: number;
  organic: number;
  metal: number;
}
