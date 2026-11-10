// src/lib/formatUtils.ts
import { Lang } from '@/types';

export const codeLabels: Record<string, Record<Lang, string>> = {
  quoted: { en: 'Quoted', es: 'Cotizada', vi: 'Đã báo giá' },
  accepted: { en: 'Accepted', es: 'Aceptada', vi: 'Đã chấp nhận' },
  checkout_pending: { en: 'Checkout pending', es: 'Pago pendiente', vi: 'Chờ thanh toán' },
  paid: { en: 'Paid', es: 'Pagada', vi: 'Đã thanh toán' },
  active: { en: 'Active', es: 'Activo', vi: 'Đang hoạt động' },
  past_due: { en: 'Payment overdue', es: 'Pago vencido', vi: 'Quá hạn thanh toán' },
  failed: { en: 'Failed', es: 'Fallido', vi: 'Thất bại' },
  pending: { en: 'Pending', es: 'Pendiente', vi: 'Đang chờ' },
  suspended: { en: 'Suspended', es: 'Suspendido', vi: 'Đã tạm ngưng' },
  cancelled: { en: 'Cancelled', es: 'Cancelado', vi: 'Đã hủy' },
  canceled: { en: 'Canceled', es: 'Cancelado', vi: 'Đã hủy' },
  completed: { en: 'Completed', es: 'Completado', vi: 'Hoàn tất' },
  refunded: { en: 'Refunded', es: 'Reembolsado', vi: 'Đã hoàn tiền' },
  partial: { en: 'Partially refunded', es: 'Reembolso parcial', vi: 'Hoàn tiền một phần' },
  cdn: { en: 'CDN', es: 'CDN', vi: 'CDN' },
  external: { en: 'External protection', es: 'Protección externa', vi: 'Bảo vệ bên ngoài' },
  internal: { en: 'Internal protection', es: 'Protección interna', vi: 'Bảo vệ nội bộ' },
  loader: { en: 'Loader', es: 'Cargador', vi: 'Trình tải' },
  license: { en: 'License', es: 'Licencia', vi: 'Giấy phép' },
  hide_resources: { en: 'Hide Resources', es: 'Ocultar Recursos', vi: 'Ẩn tài nguyên' },
  support: { en: 'Support', es: 'Soporte', vi: 'Hỗ trợ' },
  incident: { en: 'Incident', es: 'Incidencia', vi: 'Sự cố' },
  billing: { en: 'Billing', es: 'Facturación', vi: 'Thanh toán' },
  invoice: { en: 'Invoice', es: 'Factura', vi: 'Hóa đơn' },
  service: { en: 'Service', es: 'Servicio', vi: 'Dịch vụ' },
  other: { en: 'Other', es: 'Otro', vi: 'Khác' },
  activated: { en: 'Activated', es: 'Activado', vi: 'Đã kích hoạt' },
  deactivated: { en: 'Deactivated', es: 'Desactivado', vi: 'Đã tắt' },
  invoice_paid: { en: 'Invoice paid', es: 'Factura pagada', vi: 'Hóa đơn đã thanh toán' },
  invoice_payment_failed: { en: 'Invoice payment failed', es: 'Pago de factura fallido', vi: 'Thanh toán hóa đơn thất bại' },
  subscription_cancelled: { en: 'Subscription cancelled', es: 'Suscripción cancelada', vi: 'Gói đăng ký đã hủy' },
  subscription_updated: { en: 'Subscription updated', es: 'Suscripción actualizada', vi: 'Gói đăng ký đã cập nhật' },
  needs_response: { en: 'Needs response', es: 'Requiere respuesta', vi: 'Cần phản hồi' },
  under_review: { en: 'Under review', es: 'En revisión', vi: 'Đang xem xét' },
  won: { en: 'Won', es: 'Ganada', vi: 'Thắng kiện' },
  lost: { en: 'Lost', es: 'Perdida', vi: 'Thua kiện' },
  warning_needs_response: { en: 'Early warning needs response', es: 'Alerta temprana pendiente', vi: 'Cảnh báo sớm cần phản hồi' },
  warning_under_review: { en: 'Early warning under review', es: 'Alerta temprana en revisión', vi: 'Cảnh báo sớm đang xem xét' },
  warning_closed: { en: 'Early warning closed', es: 'Alerta temprana cerrada', vi: 'Cảnh báo sớm đã đóng' },
  product_not_received: { en: 'Product not received', es: 'Producto no recibido', vi: 'Chưa nhận được sản phẩm' },
  product_unacceptable: { en: 'Product unacceptable', es: 'Producto inaceptable', vi: 'Sản phẩm không đạt yêu cầu' },
  fraudulent: { en: 'Fraudulent', es: 'Fraudulento', vi: 'Gian lận' },
  duplicate: { en: 'Duplicate', es: 'Duplicado', vi: 'Trùng lặp' },
  subscription_canceled: { en: 'Subscription canceled', es: 'Suscripción cancelada', vi: 'Gói đăng ký đã hủy' },
  general: { en: 'General', es: 'General', vi: 'Chung' },
  credit_not_processed: { en: 'Credit not processed', es: 'Crédito no procesado', vi: 'Chưa xử lý hoàn tín dụng' },
  unrecognized: { en: 'Unrecognized', es: 'No reconocido', vi: 'Không nhận diện được' },
  unknown: { en: 'Unknown', es: 'Desconocido', vi: 'Không xác định' },
  open: { en: 'Open', es: 'Abierta', vi: 'Đang mở' },
  draft: { en: 'Draft', es: 'Borrador', vi: 'Bản nháp' },
  void: { en: 'Void', es: 'Anulada', vi: 'Đã vô hiệu' },
  uncollectible: { en: 'Uncollectible', es: 'Incobrable', vi: 'Không thể thu hồi' },
  block: { en: 'Block', es: 'Bloquear', vi: 'Chặn' },
  challenge: { en: 'Challenge', es: 'Desafiar', vi: 'Thử thách' },
  log: { en: 'Log', es: 'Registrar', vi: 'Ghi log' },
};

export function formatCode(lang: string, code: string): string {
  const safeLang: Lang = lang === 'es' || lang === 'vi' ? lang : 'en';
  return codeLabels[code]?.[safeLang] || code.replace(/_/g, ' ');
}

export function subscriptionStatus(lang: Lang, status: string): string {
  const key = `plans_status_${status}`;
  const map: Record<Lang, Record<string, string>> = {
    en: {
      plans_status_active: 'Active',
      plans_status_trialing: 'Trialing',
      plans_status_past_due: 'Payment overdue',
      plans_status_unpaid: 'Unpaid',
      plans_status_paused: 'Paused',
      plans_status_canceled: 'Canceled',
      plans_status_incomplete: 'Incomplete',
      plans_status_incomplete_expired: 'Expired',
    },
    es: {
      plans_status_active: 'Activa',
      plans_status_trialing: 'En prueba',
      plans_status_past_due: 'Pago pendiente',
      plans_status_unpaid: 'Impaga',
      plans_status_paused: 'Pausada',
      plans_status_canceled: 'Cancelada',
      plans_status_incomplete: 'Incompleta',
      plans_status_incomplete_expired: 'Vencida',
    },
    vi: {
      plans_status_active: 'Đang hoạt động',
      plans_status_trialing: 'Dùng thử',
      plans_status_past_due: 'Quá hạn thanh toán',
      plans_status_unpaid: 'Chưa thanh toán',
      plans_status_paused: 'Tạm dừng',
      plans_status_canceled: 'Đã hủy',
      plans_status_incomplete: 'Chưa hoàn tất',
      plans_status_incomplete_expired: 'Đã hết hạn',
    },
  };
  return map[lang]?.[key] || formatCode(lang, status);
}

export function getDateLocale(lang: Lang): string {
  if (lang === 'es') return 'es-ES';
  if (lang === 'vi') return 'vi-VN';
  return 'en-US';
}
