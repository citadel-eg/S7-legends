import { getTranslation } from '@/i18n';

export interface WhatsAppOrderParams {
  productName: string;
  player: string;
  team: string;
  year: number | string;
  size: string;
  quantity: number;
  price: number;
  productUrl: string;
}

export function buildWhatsAppMessage(params: WhatsAppOrderParams): string {
  const greeting = getTranslation('whatsapp.greeting');
  const wantToOrder = getTranslation('whatsapp.wantToOrder');
  const lblProduct = getTranslation('whatsapp.product');
  const lblPlayer = getTranslation('whatsapp.player');
  const lblTeam = getTranslation('whatsapp.team');
  const lblYear = getTranslation('whatsapp.year');
  const lblSize = getTranslation('whatsapp.size');
  const lblQuantity = getTranslation('whatsapp.quantity');
  const lblPrice = getTranslation('whatsapp.price');
  const lblLink = getTranslation('whatsapp.link');
  const closing = getTranslation('whatsapp.confirmAvailability');

  return `${greeting}
${wantToOrder}

• ${lblProduct}: ${params.productName}
• ${lblPlayer}: ${params.player}
• ${lblTeam}: ${params.team}
• ${lblYear}: ${params.year}
• ${lblSize}: ${params.size}
• ${lblQuantity}: ${params.quantity}
• ${lblPrice}: €${params.price}
• ${lblLink}: ${params.productUrl}

${closing}`;
}

export function getWhatsAppOrderUrl(params: WhatsAppOrderParams, overridePhone?: string): string {
  const phone = overridePhone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33658898860';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = buildWhatsAppMessage(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
