// src/lib/uiText.ts
import { Lang } from '@/types';

export interface UiTextEntry {
  en: string;
  es: string;
  vi: string;
}

export const UI_TEXT_ENTRIES: UiTextEntry[] = [
  {
    "en": "Addons Management",
    "es": "Administración de extras",
    "vi": "Quản lý tiện ích bổ sung"
  },
  {
    "en": "Assign addons to users",
    "es": "Asigna extras a usuarios",
    "vi": "Gán tiện ích cho người dùng"
  },
  {
    "en": "Add User Addon",
    "es": "Agregar extra a un usuario",
    "vi": "Thêm tiện ích cho người dùng"
  },
  {
    "en": "Hide All",
    "es": "Ocultar todo",
    "vi": "Ẩn tất cả"
  },
  {
    "en": "Hide 1 Resource",
    "es": "Ocultar un recurso",
    "vi": "Ẩn 1 tài nguyên"
  },
  {
    "en": "Add",
    "es": "Agregar",
    "vi": "Thêm"
  },
  {
    "en": "User",
    "es": "Usuario",
    "vi": "Người dùng"
  },
  {
    "en": "Name",
    "es": "Nombre",
    "vi": "Tên"
  },
  {
    "en": "Type",
    "es": "Tipo",
    "vi": "Loại"
  },
  {
    "en": "Added",
    "es": "Agregado",
    "vi": "Đã thêm"
  },
  {
    "en": "Actions",
    "es": "Acciones",
    "vi": "Thao tác"
  },
  {
    "en": "Loading...",
    "es": "Cargando...",
    "vi": "Đang tải..."
  },
  {
    "en": "No addons assigned",
    "es": "No hay extras asignados",
    "vi": "Chưa có tiện ích nào được gán"
  },
  {
    "en": "Bans",
    "es": "Baneos",
    "vi": "Lệnh cấm"
  },
  {
    "en": "Refresh",
    "es": "Actualizar",
    "vi": "Làm mới"
  },
  {
    "en": "Last 50 recorded events",
    "es": "Últimos 50 eventos registrados",
    "vi": "50 sự kiện được ghi nhận gần nhất"
  },
  {
    "en": "Order ID",
    "es": "ID de orden",
    "vi": "Mã đơn hàng"
  },
  {
    "en": "Ticket / Reference ID",
    "es": "Ticket / ID de referencia",
    "vi": "Ticket / Mã tham chiếu"
  },
  {
    "en": "Label",
    "es": "Etiqueta",
    "vi": "Nhãn"
  },
  {
    "en": "Domain",
    "es": "Dominio",
    "vi": "Tên miền"
  },
  {
    "en": "Owner",
    "es": "Propietario",
    "vi": "Chủ sở hữu"
  },
  {
    "en": "(optional)",
    "es": "(opcional)",
    "vi": "(tùy chọn)"
  },
  {
    "en": "Creating...",
    "es": "Creando...",
    "vi": "Đang tạo..."
  },
  {
    "en": "Create",
    "es": "Crear",
    "vi": "Tạo"
  },
  {
    "en": "Cancel",
    "es": "Cancelar",
    "vi": "Hủy"
  },
  {
    "en": "IP Lock",
    "es": "Bloqueo de IP",
    "vi": "Khóa IP"
  },
  {
    "en": "Active",
    "es": "Activo",
    "vi": "Đang hoạt động"
  },
  {
    "en": "Off",
    "es": "Desactivado",
    "vi": "Tắt"
  },
  {
    "en": "Unlocked",
    "es": "Desbloqueado",
    "vi": "Đã mở khóa"
  },
  {
    "en": "Reset IP",
    "es": "Restablecer IP",
    "vi": "Đặt lại IP"
  },
  {
    "en": "Change server label",
    "es": "Cambiar etiqueta del servidor",
    "vi": "Đổi nhãn máy chủ"
  },
  {
    "en": "Change domain or cache path",
    "es": "Cambiar dominio o ruta de caché",
    "vi": "Đổi tên miền hoặc đường dẫn cache"
  },
  {
    "en": "Change owner",
    "es": "Cambiar propietario",
    "vi": "Đổi chủ sở hữu"
  },
  {
    "en": "Reset IP lock",
    "es": "Restablecer bloqueo de IP",
    "vi": "Đặt lại khóa IP"
  },
  {
    "en": "Saving...",
    "es": "Guardando...",
    "vi": "Đang lưu..."
  },
  {
    "en": "Save label",
    "es": "Guardar etiqueta",
    "vi": "Lưu nhãn"
  },
  {
    "en": "Domain / cache path",
    "es": "Dominio / ruta de caché",
    "vi": "Tên miền / đường dẫn cache"
  },
  {
    "en": "For a shared host, include the server path key (for example /sv_rolearp/cache). Download a new peer key after changing the domain.",
    "es": "Para un host compartido, incluye la ruta del servidor (por ejemplo /sv_rolearp/cache). Descarga una nueva clave peer después de cambiar el dominio.",
    "vi": "Với shared host, hãy bao gồm đường dẫn máy chủ (ví dụ /sv_rolearp/cache). Tải khóa peer mới sau khi đổi tên miền."
  },
  {
    "en": "Change owner of",
    "es": "Cambiar propietario de",
    "vi": "Đổi chủ sở hữu của"
  },
  {
    "en": "Set as Owner",
    "es": "Asignar como propietario",
    "vi": "Đặt làm chủ sở hữu"
  },
  {
    "en": "Changing the owner transfers full Master control. The new owner must have logged in at least once.",
    "es": "Cambiar el propietario transfiere el control Master completo. El nuevo propietario debe haber iniciado sesión al menos una vez.",
    "vi": "Đổi chủ sở hữu sẽ chuyển toàn bộ quyền kiểm soát Master. Chủ sở hữu mới phải đã đăng nhập ít nhất một lần."
  },
  {
    "en": "Search by Discord ID or username",
    "es": "Buscar por Discord ID o Username",
    "vi": "Tìm theo Discord ID hoặc tên người dùng"
  },
  {
    "en": "From",
    "es": "Desde",
    "vi": "Từ ngày"
  },
  {
    "en": "To",
    "es": "Hasta",
    "vi": "Đến ngày"
  },
  {
    "en": "No users found",
    "es": "No se encontraron usuarios",
    "vi": "Không tìm thấy người dùng"
  },
  {
    "en": "Showing",
    "es": "Mostrando",
    "vi": "Đang hiển thị"
  },
  {
    "en": "of",
    "es": "de",
    "vi": "trên"
  },
  {
    "en": "users",
    "es": "usuarios",
    "vi": "người dùng"
  },
  {
    "en": "Previous",
    "es": "Anterior",
    "vi": "Trước"
  },
  {
    "en": "Next",
    "es": "Siguiente",
    "vi": "Tiếp"
  },
  {
    "en": "Title",
    "es": "Título",
    "vi": "Tiêu đề"
  },
  {
    "en": "Message",
    "es": "Mensaje",
    "vi": "Nội dung"
  },
  {
    "en": "Pin to dashboard",
    "es": "Fijar en el panel",
    "vi": "Ghim lên bảng điều khiển"
  },
  {
    "en": "(pinned)",
    "es": "(fijado)",
    "vi": "(đã ghim)"
  },
  {
    "en": "Published (",
    "es": "Publicadas (",
    "vi": "Đã đăng ("
  },
  {
    "en": "No announcements published yet",
    "es": "Aún no hay novedades publicadas",
    "vi": "Chưa có thông báo nào được đăng"
  },
  {
    "en": "PINNED",
    "es": "FIJADO",
    "vi": "ĐÃ GHIM"
  },
  {
    "en": "Edit",
    "es": "Editar",
    "vi": "Sửa"
  },
  {
    "en": "Delete",
    "es": "Eliminar",
    "vi": "Xóa"
  },
  {
    "en": "Artifacts (AD)",
    "es": "Artifacts (AD)",
    "vi": "Artifacts (AD)"
  },
  {
    "en": "Download specialized artifacts with built-in privacy protection.",
    "es": "Descarga artifacts especializados con protección de privacidad integrada.",
    "vi": "Tải xuống các artifact chuyên biệt tích hợp bảo vệ quyền riêng tư."
  },
  {
    "en": "Configuration",
    "es": "Configuración",
    "vi": "Cấu hình"
  },
  {
    "en": "Anti Dump Artifacts",
    "es": "Artifacts Anti Dump",
    "vi": "Artifacts Anti Dump"
  },
  {
    "en": "These artifacts are modified to prevent resource dumping bypass cdn specific internal functions.",
    "es": "Estos artifacts están modificados para impedir la extracción de recursos y proteger funciones internas del CDN.",
    "vi": "Các artifact này đã được chỉnh sửa để ngăn đánh cắp tài nguyên và bảo vệ các hàm nội bộ của CDN."
  },
  {
    "en": "Real-time diagnosis of incoming webhook and API requests",
    "es": "Diagnóstico en tiempo real de solicitudes entrantes a webhooks y API",
    "vi": "Chẩn đoán thời gian thực các yêu cầu webhook và API gửi đến"
  },
  {
    "en": "Live Mode",
    "es": "Modo en vivo",
    "vi": "Chế độ trực tiếp"
  },
  {
    "en": "req/min",
    "es": "solicitudes/min",
    "vi": "yêu cầu/phút"
  },
  {
    "en": "Clear Logs",
    "es": "Borrar registros",
    "vi": "Xóa nhật ký"
  },
  {
    "en": "IP Address",
    "es": "Dirección IP",
    "vi": "Địa chỉ IP"
  },
  {
    "en": "Search Body/Headers",
    "es": "Buscar en cuerpo/cabeceras",
    "vi": "Tìm trong Body/Headers"
  },
  {
    "en": "Apply Filters",
    "es": "Aplicar filtros",
    "vi": "Áp dụng bộ lọc"
  },
  {
    "en": "Clear",
    "es": "Limpiar",
    "vi": "Xóa lọc"
  },
  {
    "en": "Date/Time",
    "es": "Fecha/hora",
    "vi": "Ngày/Giờ"
  },
  {
    "en": "Method",
    "es": "Método",
    "vi": "Phương thức"
  },
  {
    "en": "Path",
    "es": "Ruta",
    "vi": "Đường dẫn"
  },
  {
    "en": "Country",
    "es": "País",
    "vi": "Quốc gia"
  },
  {
    "en": "Time",
    "es": "Hora",
    "vi": "Thời gian"
  },
  {
    "en": "Action",
    "es": "Acción",
    "vi": "Hành động"
  },
  {
    "en": "No debug logs found.",
    "es": "No se encontraron registros de depuración.",
    "vi": "Không tìm thấy nhật ký gỡ lỗi nào."
  },
  {
    "en": "View",
    "es": "Ver",
    "vi": "Xem"
  },
  {
    "en": "Request Details",
    "es": "Detalles de la solicitud",
    "vi": "Chi tiết yêu cầu"
  },
  {
    "en": "Real Event Metadata",
    "es": "Metadatos del evento real",
    "vi": "Siêu dữ liệu sự kiện thực"
  },
  {
    "en": "Body",
    "es": "Cuerpo",
    "vi": "Nội dung (Body)"
  },
  {
    "en": "Copy JSON",
    "es": "Copiar JSON",
    "vi": "Sao chép JSON"
  },
  {
    "en": "Empty body",
    "es": "Cuerpo vacío",
    "vi": "Nội dung trống"
  },
  {
    "en": "Hover to reveal",
    "es": "Pasa el cursor para mostrar",
    "vi": "Di chuột để hiện"
  },
  {
    "en": "IP Lists",
    "es": "Listas de IP",
    "vi": "Danh sách IP"
  },
  {
    "en": "Manage IP filtering rules for",
    "es": "Administra las reglas de filtrado IP para",
    "vi": "Quản lý quy tắc lọc IP cho"
  },
  {
    "en": "Select a server to manage IP filters",
    "es": "Selecciona un servidor para administrar filtros IP",
    "vi": "Chọn một máy chủ để quản lý bộ lọc IP"
  },
  {
    "en": "Access Denied",
    "es": "Acceso denegado",
    "vi": "Từ chối truy cập"
  },
  {
    "en": "You need",
    "es": "Necesitas el permiso",
    "vi": "Bạn cần có"
  },
  {
    "en": "permission",
    "es": "",
    "vi": "quyền"
  },
  {
    "en": "Add to",
    "es": "Agregar a",
    "vi": "Thêm vào"
  },
  {
    "en": "Note",
    "es": "Nota",
    "vi": "Ghi chú"
  },
  {
    "en": "No",
    "es": "No hay",
    "vi": "Chưa có"
  },
  {
    "en": "entries yet",
    "es": "entradas todavía",
    "vi": "mục nào"
  },
  {
    "en": "Add IPs above to get started",
    "es": "Agrega direcciones IP arriba para comenzar",
    "vi": "Thêm địa chỉ IP ở trên để bắt đầu"
  },
  {
    "en": "Block",
    "es": "Bloquear",
    "vi": "Chặn"
  },
  {
    "en": "Challenge",
    "es": "Desafiar",
    "vi": "Thử thách"
  },
  {
    "en": "Log",
    "es": "Registrar",
    "vi": "Ghi log"
  },
  {
    "en": "Copy ID",
    "es": "Copiar ID",
    "vi": "Sao chép ID"
  },
  {
    "en": "Error",
    "es": "Error",
    "vi": "Lỗi"
  },
  {
    "en": "Authentication Failed",
    "es": "Error de autenticación",
    "vi": "Xác thực thất bại"
  },
  {
    "en": "There was an error signing in with Discord. You may not have permission to access this application.",
    "es": "Ocurrió un error al iniciar sesión con Discord. Es posible que no tengas permiso para acceder a esta aplicación.",
    "vi": "Đã xảy ra lỗi khi đăng nhập bằng Discord. Có thể bạn chưa có quyền truy cập ứng dụng này."
  },
  {
    "en": "Back to Login",
    "es": "Volver al inicio de sesión",
    "vi": "Quay lại đăng nhập"
  },
  {
    "en": "Home",
    "es": "Inicio",
    "vi": "Trang chủ"
  },
  {
    "en": "Error 404",
    "es": "Error 404",
    "vi": "Lỗi 404"
  },
  {
    "en": "Security Perimeter: Resource Not Found",
    "es": "Perímetro de seguridad: recurso no encontrado",
    "vi": "Vành đai bảo mật: Không tìm thấy tài nguyên"
  },
  {
    "en": "The requested route or sector does not exist, has been restricted, or was relocated under heightened security policies.",
    "es": "La ruta solicitada no existe, está restringida o fue trasladada por las políticas de seguridad.",
    "vi": "Đường dẫn hoặc phân vùng bạn yêu cầu không tồn tại, đã bị hạn chế hoặc đã được di chuyển theo chính sách bảo mật tăng cường."
  },
  {
    "en": "Return to Safety",
    "es": "Volver a un lugar seguro",
    "vi": "Quay về nơi an toàn"
  },
  {
    "en": "Open Dashboard",
    "es": "Abrir panel",
    "vi": "Mở bảng điều khiển"
  },
  {
    "en": "Discord Support",
    "es": "Soporte por Discord",
    "vi": "Hỗ trợ qua Discord"
  },
  {
    "en": "CFX AntiDump. System online & protected.",
    "es": "CFX AntiDump. Sistema en línea y protegido.",
    "vi": "CFX AntiDump. Hệ thống đang hoạt động & được bảo vệ."
  },
  {
    "en": "Legal Notice",
    "es": "Aviso legal",
    "vi": "Thông báo pháp lý"
  },
  {
    "en": "Privacy Policy",
    "es": "Política de privacidad",
    "vi": "Chính sách quyền riêng tư"
  },
  {
    "en": "Cookie Policy",
    "es": "Política de cookies",
    "vi": "Chính sách cookie"
  },
  {
    "en": "All rights reserved.",
    "es": "Todos los derechos reservados.",
    "vi": "Mọi quyền được bảo lưu."
  },
  {
    "en": "Cookie Preferences",
    "es": "Preferencias de cookies",
    "vi": "Tùy chọn cookie"
  },
  {
    "en": "Manage Cookie Preferences",
    "es": "Administrar preferencias de cookies",
    "vi": "Quản lý tùy chọn cookie"
  },
  {
    "en": "We use essential security cookies to run this panel and anonymized performance telemetry to optimize response times and defense capabilities.",
    "es": "Usamos cookies de seguridad esenciales para el funcionamiento del panel y estadísticas anónimas para mejorar el rendimiento y la protección.",
    "vi": "Chúng tôi sử dụng cookie bảo mật thiết yếu để vận hành bảng điều khiển này và dữ liệu đo lường hiệu năng ẩn danh nhằm tối ưu thời gian phản hồi và khả năng phòng thủ."
  },
  {
    "en": "Essential & Security Cookies",
    "es": "Cookies esenciales y de seguridad",
    "vi": "Cookie thiết yếu & bảo mật"
  },
  {
    "en": "Required for session authentication and anti-tamper security.",
    "es": "Necesarias para autenticar sesiones y proteger contra manipulaciones.",
    "vi": "Bắt buộc cho xác thực phiên đăng nhập và bảo mật chống giả mạo."
  },
  {
    "en": "Always Active",
    "es": "Siempre activas",
    "vi": "Luôn hoạt động"
  },
  {
    "en": "Analytics Telemetry",
    "es": "Estadísticas de uso",
    "vi": "Đo lường phân tích"
  },
  {
    "en": "Anonymized performance measurements to detect network bottlenecks.",
    "es": "Mediciones anónimas del rendimiento para detectar problemas de red.",
    "vi": "Các chỉ số hiệu năng ẩn danh nhằm phát hiện điểm nghẽn mạng."
  },
  {
    "en": "Preferences & UI State",
    "es": "Preferencias y estado de la interfaz",
    "vi": "Tùy chọn & trạng thái giao diện"
  },
  {
    "en": "Remembers selected language and interface preferences.",
    "es": "Recuerda el idioma seleccionado y las preferencias de la interfaz.",
    "vi": "Ghi nhớ ngôn ngữ đã chọn và các tùy chỉnh giao diện."
  },
  {
    "en": "Back",
    "es": "Volver",
    "vi": "Quay lại"
  },
  {
    "en": "Save Choices",
    "es": "Guardar preferencias",
    "vi": "Lưu lựa chọn"
  },
  {
    "en": "Customize",
    "es": "Personalizar",
    "vi": "Tùy chỉnh"
  },
  {
    "en": "Essential Only",
    "es": "Solo esenciales",
    "vi": "Chỉ cookie thiết yếu"
  },
  {
    "en": "Accept All",
    "es": "Aceptar todas",
    "vi": "Chấp nhận tất cả"
  },
  {
    "en": "Live",
    "es": "En vivo",
    "vi": "Trực tiếp"
  },
  {
    "en": "Close menu",
    "es": "Cerrar menú",
    "vi": "Đóng menu"
  },
  {
    "en": "Open menu",
    "es": "Abrir menú",
    "vi": "Mở menu"
  },
  {
    "en": "Cookie Consent Banner",
    "es": "Aviso de consentimiento de cookies",
    "vi": "Thông báo chấp thuận cookie"
  },
  {
    "en": "Leave this field blank",
    "es": "Deja este campo en blanco",
    "vi": "Để trống trường này"
  },
  {
    "en": "Legal & compliance",
    "es": "Avisos legales",
    "vi": "Pháp lý & tuân thủ"
  },
  {
    "en": "Search user or leave blank…",
    "es": "Busca un usuario o deja el campo vacío…",
    "vi": "Tìm người dùng hoặc để trống…"
  },
  {
    "en": "Search new owner…",
    "es": "Buscar nuevo propietario…",
    "vi": "Tìm chủ sở hữu mới…"
  },
  {
    "en": "Discord ID or name...",
    "es": "ID de Discord o nombre...",
    "vi": "Discord ID hoặc tên..."
  },
  {
    "en": "Resource name (required)",
    "es": "Nombre del recurso (obligatorio)",
    "vi": "Tên tài nguyên (bắt buộc)"
  },
  {
    "en": "Not required for Hide All",
    "es": "No es necesario para Ocultar todo",
    "vi": "Không cần thiết cho Ẩn tất cả"
  },
  {
    "en": "IP address or CIDR (e.g. 192.168.1.1 or 10.0.0.0/24)",
    "es": "Dirección IP o CIDR (p. ej., 192.168.1.1 o 10.0.0.0/24)",
    "vi": "Địa chỉ IP hoặc CIDR (vd: 192.168.1.1 hoặc 10.0.0.0/24)"
  },
  {
    "en": "Note (optional)",
    "es": "Nota (opcional)",
    "vi": "Ghi chú (tùy chọn)"
  },
  {
    "en": "My Server",
    "es": "Mi servidor",
    "vi": "Máy chủ của tôi"
  },
  {
    "en": "example.com or sv_cache.kstudios.xyz/sv_rolearp/cache",
    "es": "example.com o sv_cache.kstudios.xyz/sv_rolearp/cache",
    "vi": "example.com hoặc sv_cache.kstudios.xyz/sv_rolearp/cache"
  },
  {
    "en": "Query...",
    "es": "Consulta...",
    "vi": "Truy vấn..."
  },
  {
    "en": "Logs cleared successfully",
    "es": "Registros borrados correctamente",
    "vi": "Đã xóa nhật ký thành công"
  },
  {
    "en": "Copied to clipboard",
    "es": "Copiado al portapapeles",
    "vi": "Đã sao chép vào khay nhớ tạm"
  },
  {
    "en": "Error creating addon, make sure the user exists",
    "es": "No se pudo crear el extra. Comprueba que el usuario exista.",
    "vi": "Không thể tạo tiện ích. Hãy kiểm tra xem người dùng có tồn tại không."
  },
  {
    "en": "Error deleting addon",
    "es": "No se pudo eliminar el extra",
    "vi": "Không thể xóa tiện ích"
  },
  {
    "en": "Error deleting ban",
    "es": "No se pudo eliminar el baneo",
    "vi": "Không thể xóa lệnh cấm"
  },
  {
    "en": "Failed to load invoices",
    "es": "No se pudieron cargar las facturas",
    "vi": "Không thể tải hóa đơn"
  },
  {
    "en": "Failed to load team",
    "es": "No se pudo cargar el equipo",
    "vi": "Không thể tải đội ngũ"
  },
  {
    "en": "Failed to add user",
    "es": "No se pudo agregar el usuario",
    "vi": "Không thể thêm người dùng"
  },
  {
    "en": "Failed to update permissions",
    "es": "No se pudieron actualizar los permisos",
    "vi": "Không thể cập nhật quyền hạn"
  },
  {
    "en": "Failed to remove member",
    "es": "No se pudo eliminar el miembro",
    "vi": "Không thể xóa thành viên"
  },
  {
    "en": "Delete this server and ALL its data? This cannot be undone.",
    "es": "¿Eliminar este servidor y TODOS sus datos? Esta acción no se puede deshacer.",
    "vi": "Xóa máy chủ này và TOÀN BỘ dữ liệu của nó? Hành động này không thể hoàn tác."
  },
  {
    "en": "Delete this announcement?",
    "es": "¿Eliminar esta novedad?",
    "vi": "Xóa thông báo này?"
  },
  {
    "en": "Describe important changes, maintenance or notices…",
    "es": "Describe los cambios, mantenimientos o avisos importantes…",
    "vi": "Mô tả các thay đổi quan trọng, bảo trì hoặc thông báo…"
  },
  {
    "en": "Back to Home",
    "es": "Volver al inicio",
    "vi": "Quay về trang chủ"
  },
  {
    "en": "← Back to Home",
    "es": "← Volver al inicio",
    "vi": "← Quay về trang chủ"
  },
  {
    "en": "Transparency & Privacy",
    "es": "Transparencia y privacidad",
    "vi": "Minh bạch & Quyền riêng tư"
  },
  {
    "en": "Last updated: October 4, 2026",
    "es": "Última actualización: 4 de octubre de 2026",
    "vi": "Cập nhật lần cuối: 4 tháng 10, 2026"
  },
  {
    "en": "1. What are Cookies?",
    "es": "1. ¿Qué son las cookies?",
    "vi": "1. Cookie là gì?"
  },
  {
    "en": "A cookie is a compact text file that a website stores on your computer or mobile device when you visit. Cookies enable the platform to recall your actions, session state, and security preferences (such as authentication tokens and interface configurations) over time.",
    "es": "Una cookie es un pequeño archivo de texto que un sitio web guarda en tu dispositivo. Permite recordar tus acciones, el estado de la sesión y preferencias de seguridad, como los tokens de autenticación y la configuración de la interfaz.",
    "vi": "Cookie là một tệp văn bản nhỏ mà trang web lưu trên máy tính hoặc thiết bị di động của bạn khi truy cập. Cookie giúp nền tảng ghi nhớ thao tác, trạng thái phiên đăng nhập và tùy chọn bảo mật (như token xác thực và cấu hình giao diện) theo thời gian."
  },
  {
    "en": "2. Categories of Cookies We Use",
    "es": "2. Categorías de cookies que usamos",
    "vi": "2. Các loại cookie chúng tôi sử dụng"
  },
  {
    "en": "A. Strictly Necessary & Technical Cookies",
    "es": "A. Cookies técnicas y estrictamente necesarias",
    "vi": "A. Cookie kỹ thuật & thiết yếu"
  },
  {
    "en": "Required",
    "es": "Obligatorias",
    "vi": "Bắt buộc"
  },
  {
    "en": "Essential for the core security and functionality of the dashboard. These include Discord OAuth session signatures, CSRF mitigation tokens, and tamper-resistant authentication state. They cannot be disabled.",
    "es": "Son necesarias para la seguridad y el funcionamiento del panel. Incluyen firmas de sesión de Discord OAuth, tokens de protección CSRF y estado de autenticación protegido contra manipulaciones. No se pueden desactivar.",
    "vi": "Cần thiết cho bảo mật cốt lõi và khả năng vận hành của bảng điều khiển. Bao gồm chữ ký phiên Discord OAuth, token chống tấn công CSRF và trạng thái xác thực chống giả mạo. Không thể tắt nhóm cookie này."
  },
  {
    "en": "B. Preference & UI Cookies",
    "es": "B. Cookies de preferencias e interfaz",
    "vi": "B. Cookie tùy chọn & giao diện"
  },
  {
    "en": "Optional",
    "es": "Opcionales",
    "vi": "Tùy chọn"
  },
  {
    "en": "Allow the application to remember choices you make, such as language preference and collapsed sidebar states across browser sessions.",
    "es": "Permiten recordar tus elecciones, como el idioma y el estado de la barra lateral, entre sesiones del navegador.",
    "vi": "Cho phép ứng dụng ghi nhớ các lựa chọn của bạn, như ngôn ngữ và trạng thái thu gọn thanh bên qua các phiên trình duyệt."
  },
  {
    "en": "C. Performance & Analytics Cookies",
    "es": "C. Cookies de rendimiento y análisis",
    "vi": "C. Cookie hiệu năng & phân tích"
  },
  {
    "en": "Gather aggregated, privacy-anonymized metrics on latency and user flows to help us resolve bottlenecks and optimize platform speed. These only initialize if you explicitly grant consent.",
    "es": "Recopilan métricas agregadas y anónimas sobre latencia y navegación para resolver problemas y mejorar la velocidad. Solo se activan si das tu consentimiento.",
    "vi": "Thu thập số liệu tổng hợp đã ẩn danh về độ trễ và luồng sử dụng để giúp chúng tôi khắc phục điểm nghẽn và tối ưu tốc độ nền tảng. Chỉ kích hoạt khi bạn đồng ý rõ ràng."
  },
  {
    "en": "3. Cookie Inventory Table",
    "es": "3. Inventario de cookies",
    "vi": "3. Danh mục cookie sử dụng"
  },
  {
    "en": "Cookie Key",
    "es": "Clave de cookie",
    "vi": "Khóa cookie"
  },
  {
    "en": "Purpose",
    "es": "Finalidad",
    "vi": "Mục đích"
  },
  {
    "en": "Lifespan",
    "es": "Duración",
    "vi": "Thời hạn"
  },
  {
    "en": "Technical",
    "es": "Técnica",
    "vi": "Kỹ thuật"
  },
  {
    "en": "Cryptographically secured user session token",
    "es": "Token de sesión de usuario protegido criptográficamente",
    "vi": "Token phiên người dùng được bảo vệ bằng mật mã"
  },
  {
    "en": "7 Days / Session",
    "es": "7 días / sesión",
    "vi": "7 ngày / Phiên"
  },
  {
    "en": "Saves your granular cookie consent configuration",
    "es": "Guarda tus preferencias de consentimiento de cookies",
    "vi": "Lưu cấu hình chấp thuận cookie chi tiết của bạn"
  },
  {
    "en": "1 Year",
    "es": "1 año",
    "vi": "1 năm"
  },
  {
    "en": "Preference",
    "es": "Preferencia",
    "vi": "Tùy chọn"
  },
  {
    "en": "Remembers selected interface language",
    "es": "Recuerda el idioma seleccionado",
    "vi": "Ghi nhớ ngôn ngữ giao diện đã chọn"
  },
  {
    "en": "Analytics",
    "es": "Análisis",
    "vi": "Phân tích"
  },
  {
    "en": "Anonymized traffic telemetry (IP masked)",
    "es": "Estadísticas de tráfico anónimas (IP enmascarada)",
    "vi": "Dữ liệu đo lường lưu lượng ẩn danh (đã che IP)"
  },
  {
    "en": "Up to 2 Years",
    "es": "Hasta 2 años",
    "vi": "Tối đa 2 năm"
  },
  {
    "en": "4. Managing & Revoking Consent",
    "es": "4. Administrar y retirar el consentimiento",
    "vi": "4. Quản lý & thu hồi sự đồng ý"
  },
  {
    "en": "You can modify your consent settings anytime by clicking the cookie preferences button on this page or in the footer. Additionally, you may configure your browser to block or alert you about cookies:",
    "es": "Puedes cambiar tus preferencias de consentimiento en cualquier momento con el botón de esta página o del pie de página. También puedes configurar tu navegador para bloquear las cookies o recibir avisos:",
    "vi": "Bạn có thể thay đổi cài đặt đồng ý bất cứ lúc nào bằng nút tùy chọn cookie trên trang này hoặc ở chân trang. Ngoài ra, bạn có thể cấu hình trình duyệt để chặn hoặc cảnh báo về cookie:"
  },
  {
    "en": "Settings → Privacy and Security → Cookies and other site data.",
    "es": "Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.",
    "vi": "Cài đặt → Quyền riêng tư và bảo mật → Cookie và dữ liệu trang web khác."
  },
  {
    "en": "Settings → Privacy & Security → Cookies and Site Data.",
    "es": "Configuración → Privacidad y seguridad → Cookies y datos del sitio.",
    "vi": "Cài đặt → Quyền riêng tư & bảo mật → Cookie và dữ liệu trang."
  },
  {
    "en": "Preferences → Privacy → Manage Website Data.",
    "es": "Preferencias → Privacidad → Administrar datos de sitios web.",
    "vi": "Tùy chọn → Quyền riêng tư → Quản lý dữ liệu trang web."
  },
  {
    "en": "Settings → Cookies and Site Permissions.",
    "es": "Configuración → Cookies y permisos del sitio.",
    "vi": "Cài đặt → Cookie và quyền trang web."
  },
  {
    "en": "Effective November 8, 2026",
    "es": "Vigente desde el 8 de noviembre de 2026",
    "vi": "Có hiệu lực từ ngày 8 tháng 11, 2026"
  },
  {
    "en": "Operator and contact",
    "es": "Operador y contacto",
    "vi": "Đơn vị vận hành và liên hệ"
  },
  {
    "en": "CFX AntiDump is a software service operated by",
    "es": "CFX AntiDump es un servicio de software operado por",
    "vi": "CFX AntiDump là dịch vụ phần mềm được vận hành bởi"
  },
  {
    "en": ". It provides software and network protection services for FiveM/CFX.re servers. Contact",
    "es": ". Ofrece software y servicios de protección de red para servidores FiveM/CFX.re. Escribe a",
    "vi": ". Nền tảng cung cấp phần mềm và dịch vụ bảo vệ mạng cho máy chủ FiveM/CFX.re. Liên hệ"
  },
  {
    "en": "or",
    "es": "o",
    "vi": "hoặc"
  },
  {
    "en": "for billing, cancellation, refunds, service issues or privacy requests.",
    "es": "para consultas sobre facturación, cancelación, reembolsos, problemas del servicio o privacidad.",
    "vi": "để được hỗ trợ về thanh toán, hủy gói, hoàn tiền, sự cố dịch vụ hoặc yêu cầu quyền riêng tư."
  },
  {
    "en": "Mailing address:",
    "es": "Dirección postal:",
    "vi": "Địa chỉ liên hệ:"
  },
  {
    "en": "Orders and acceptance",
    "es": "Pedidos y aceptación",
    "vi": "Đơn hàng và chấp thuận"
  },
  {
    "en": "Before starting Stripe Checkout, the panel presents the selected plan, capacity, monthly price, activation conditions and the applicable Terms, Refund Policy and Privacy Policy. A customer must affirmatively accept the displayed versions. Simply visiting the panel does not accept a purchase agreement.",
    "es": "Antes de iniciar Stripe Checkout, el panel muestra el plan, la capacidad, el precio mensual, las condiciones de activación y los Términos, la Política de reembolsos y la Política de privacidad aplicables. El cliente debe aceptar expresamente las versiones mostradas. Visitar el panel no constituye aceptación de un contrato de compra.",
    "vi": "Trước khi bắt đầu Stripe Checkout, bảng điều khiển hiển thị gói đã chọn, sức chứa, giá hàng tháng, điều kiện kích hoạt cùng Điều khoản, Chính sách hoàn tiền và Chính sách quyền riêng tư áp dụng. Khách hàng phải chủ động xác nhận đồng ý các phiên bản được hiển thị. Việc chỉ truy cập bảng điều khiển không cấu thành sự chấp thuận hợp đồng mua hàng."
  },
  {
    "en": "Service limits",
    "es": "Límites del servicio",
    "vi": "Giới hạn dịch vụ"
  },
  {
    "en": "Protection tools reduce risks but cannot guarantee that every attack, extraction attempt or outage is prevented. Availability and activation depend on the selected components and configuration. For an order or service problem, contact support so we can investigate and offer a resolution. Applicable statutory rights remain available.",
    "es": "Las herramientas de protección reducen riesgos, pero no pueden garantizar la prevención de todos los ataques, extracciones o interrupciones. La disponibilidad y activación dependen de los componentes y la configuración elegidos. Si tienes un problema con un pedido o el servicio, contacta con soporte para que podamos investigarlo y ofrecer una solución. Se mantienen los derechos legales aplicables.",
    "vi": "Các công cụ bảo vệ giúp giảm thiểu rủi ro nhưng không thể đảm bảo ngăn chặn tuyệt đối mọi cuộc tấn công, trích xuất hoặc gián đoạn. Khả năng hoạt động và kích hoạt phụ thuộc vào thành phần và cấu hình đã chọn. Nếu gặp sự cố về đơn hàng hoặc dịch vụ, hãy liên hệ hỗ trợ để chúng tôi kiểm tra và đưa ra hướng xử lý. Các quyền lợi theo luật định vẫn được giữ nguyên."
  },
  {
    "en": "Account and service data",
    "es": "Datos de cuenta y del servicio",
    "vi": "Dữ liệu tài khoản và dịch vụ"
  },
  {
    "en": "We use your Discord ID, username and avatar to authenticate you and manage access to servers. We also process server domains, configuration, security events, ban reports, request paths, IP addresses, timestamps and diagnostic logs to provide and protect the service. Server owners control access to their own server data.",
    "es": "Usamos tu ID de Discord, nombre de usuario y avatar para autenticarte y administrar el acceso a servidores. También tratamos dominios, configuración, eventos de seguridad, reportes de baneos, rutas solicitadas, direcciones IP, fechas y registros de diagnóstico para prestar y proteger el servicio. Los propietarios controlan el acceso a los datos de sus servidores.",
    "vi": "Chúng tôi sử dụng Discord ID, tên người dùng và ảnh đại diện của bạn để xác thực và quản lý quyền truy cập máy chủ. Chúng tôi cũng xử lý tên miền máy chủ, cấu hình, sự kiện bảo mật, báo cáo cấm, đường dẫn yêu cầu, địa chỉ IP, mốc thời gian và nhật ký chẩn đoán để cung cấp và bảo vệ dịch vụ. Chủ máy chủ kiểm soát quyền truy cập vào dữ liệu máy chủ của mình."
  },
  {
    "en": "Orders and payments",
    "es": "Pedidos y pagos",
    "vi": "Đơn hàng và thanh toán"
  },
  {
    "en": "We record the plan, quoted price, project and contact details, the agreement version you accepted, order status and Stripe identifiers. Stripe processes card payments and may receive billing details. We do not store full card numbers. Order, payment and support records may be retained to handle accounting, service issues and disputes.",
    "es": "Registramos el plan, el precio cotizado, los datos del proyecto y contacto, la versión del acuerdo aceptada, el estado del pedido y los identificadores de Stripe. Stripe procesa los pagos con tarjeta y puede recibir datos de facturación. No guardamos números completos de tarjeta. Podemos conservar registros de pedidos, pagos y soporte para contabilidad, problemas del servicio y disputas.",
    "vi": "Chúng tôi lưu lại thông tin gói dịch vụ, mức giá báo, thông tin dự án và liên hệ, phiên bản thỏa thuận bạn đã chấp nhận, trạng thái đơn hàng và mã định danh Stripe. Stripe xử lý thanh toán thẻ và có thể nhận thông tin thanh toán. Chúng tôi không lưu số thẻ đầy đủ. Hồ sơ đơn hàng, thanh toán và hỗ trợ có thể được lưu trữ phục vụ kế toán, xử lý sự cố và tranh chấp."
  },
  {
    "en": "Support and communications",
    "es": "Soporte y comunicaciones",
    "vi": "Hỗ trợ và liên lạc"
  },
  {
    "en": "When you request support, we process your message, attachments and related service events to investigate and respond. We may send transactional messages about orders and service status to the email you provide. Our support address is support@cfxantidump.com.",
    "es": "Cuando solicitas soporte, tratamos tu mensaje, adjuntos y eventos relacionados del servicio para investigar y responder. Podemos enviar mensajes transaccionales sobre pedidos y estado del servicio al correo que proporciones. Nuestro correo de soporte es support@cfxantidump.com.",
    "vi": "Khi bạn yêu cầu hỗ trợ, chúng tôi xử lý tin nhắn, tệp đính kèm và các sự kiện dịch vụ liên quan để kiểm tra và phản hồi. Chúng tôi có thể gửi thông báo giao dịch về đơn hàng và trạng thái dịch vụ tới email bạn cung cấp. Địa chỉ hỗ trợ của chúng tôi là support@cfxantidump.com."
  },
  {
    "en": "Security, retention and your requests",
    "es": "Seguridad, conservación y tus solicitudes",
    "vi": "Bảo mật, lưu trữ và yêu cầu của bạn"
  },
  {
    "en": "We restrict administrative access and retain records according to operational, accounting, fraud prevention and legal needs. You can request access, correction or deletion where applicable by contacting support@cfxantidump.com. Some records may need to be kept for an active dispute or legal obligation. Essential session cookies support authentication; see our Cookie Policy for details.",
    "es": "Limitamos el acceso administrativo y conservamos registros según las necesidades operativas, contables, de prevención de fraude y legales. Puedes solicitar acceso, corrección o eliminación, cuando corresponda, escribiendo a support@cfxantidump.com. Algunos registros deben conservarse por disputas activas u obligaciones legales. Las cookies de sesión esenciales permiten la autenticación; consulta la Política de cookies.",
    "vi": "Chúng tôi giới hạn quyền truy cập quản trị và lưu giữ hồ sơ theo nhu cầu vận hành, kế toán, phòng chống gian lận và pháp lý. Bạn có thể yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu khi áp dụng bằng cách liên hệ support@cfxantidump.com. Một số hồ sơ có thể cần được giữ lại cho tranh chấp đang xử lý hoặc nghĩa vụ pháp lý. Cookie phiên thiết yếu hỗ trợ xác thực; xem Chính sách cookie để biết thêm chi tiết."
  },
  {
    "en": "CFX ANTIDUMP COMPANY operates CFX AntiDump. This policy covers its website, customer panel, subscriptions, CDN and protection services. We use personal data to deliver the service, process orders, answer support requests and keep the platform secure.",
    "es": "CFX ANTIDUMP COMPANY opera CFX AntiDump. Esta política cubre el sitio web, el panel de clientes, las suscripciones, el CDN y los servicios de protección. Usamos datos personales para prestar el servicio, procesar pedidos, atender solicitudes de soporte y proteger la plataforma.",
    "vi": "CFX ANTIDUMP COMPANY vận hành CFX AntiDump. Chính sách này áp dụng cho trang web, bảng điều khiển khách hàng, gói đăng ký, CDN và các dịch vụ bảo vệ. Chúng tôi sử dụng dữ liệu cá nhân để cung cấp dịch vụ, xử lý đơn hàng, trả lời yêu cầu hỗ trợ và giữ an toàn cho nền tảng."
  },
  {
    "en": "Contact:",
    "es": "Contacto:",
    "vi": "Liên hệ:"
  },
  {
    "en": "Phone:",
    "es": "Teléfono:",
    "vi": "Điện thoại:"
  },
  {
    "en": "CFX AntiDump. All rights reserved.",
    "es": "CFX AntiDump. Todos los derechos reservados.",
    "vi": "CFX AntiDump. Mọi quyền được bảo lưu."
  },
  {
    "en": "on",
    "es": "en",
    "vi": "trên"
  },
  {
    "en": "Super Admin",
    "es": "Superadministrador",
    "vi": "Quản trị viên cấp cao"
  },
  {
    "en": "Unknown",
    "es": "Desconocido",
    "vi": "Không xác định"
  },
  {
    "en": "Server created successfully",
    "es": "Servidor creado correctamente",
    "vi": "Tạo máy chủ thành công"
  },
  {
    "en": "Failed to create server",
    "es": "No se pudo crear el servidor",
    "vi": "Tạo máy chủ thất bại"
  },
  {
    "en": "Server deleted",
    "es": "Servidor eliminado",
    "vi": "Đã xóa máy chủ"
  },
  {
    "en": "Failed to delete server",
    "es": "No se pudo eliminar el servidor",
    "vi": "Xóa máy chủ thất bại"
  },
  {
    "en": "Owner updated successfully",
    "es": "Propietario actualizado correctamente",
    "vi": "Cập nhật chủ sở hữu thành công"
  },
  {
    "en": "Failed to update owner",
    "es": "No se pudo actualizar el propietario",
    "vi": "Cập nhật chủ sở hữu thất bại"
  },
  {
    "en": "Server label updated",
    "es": "Etiqueta del servidor actualizada",
    "vi": "Đã cập nhật nhãn máy chủ"
  },
  {
    "en": "Failed to update server label",
    "es": "No se pudo actualizar la etiqueta del servidor",
    "vi": "Cập nhật nhãn máy chủ thất bại"
  },
  {
    "en": "Domain updated. Download a new peer key if this server uses one.",
    "es": "Dominio actualizado. Descarga una nueva clave peer si este servidor la utiliza.",
    "vi": "Đã cập nhật tên miền. Hãy tải khóa peer mới nếu máy chủ này sử dụng."
  },
  {
    "en": "Failed to update domain",
    "es": "No se pudo actualizar el dominio",
    "vi": "Cập nhật tên miền thất bại"
  },
  {
    "en": "IP lock reset. The next script authentication will set the new IP.",
    "es": "Bloqueo de IP restablecido. La próxima autenticación del script establecerá la nueva IP.",
    "vi": "Đã đặt lại khóa IP. Lần xác thực script tiếp theo sẽ gán IP mới."
  },
  {
    "en": "Failed to reset IP lock",
    "es": "No se pudo restablecer el bloqueo de IP",
    "vi": "Đặt lại khóa IP thất bại"
  },
  {
    "en": "Announcement updated",
    "es": "Novedad actualizada",
    "vi": "Đã cập nhật thông báo"
  },
  {
    "en": "Announcement published",
    "es": "Novedad publicada",
    "vi": "Đã đăng thông báo"
  },
  {
    "en": "Error saving",
    "es": "Error al guardar",
    "vi": "Lỗi khi lưu"
  },
  {
    "en": "Announcement deleted",
    "es": "Novedad eliminada",
    "vi": "Đã xóa thông báo"
  },
  {
    "en": "Error deleting",
    "es": "Error al eliminar",
    "vi": "Lỗi khi xóa"
  },
  {
    "en": "Reset the IP lock for",
    "es": "¿Restablecer el bloqueo de IP de",
    "vi": "Đặt lại khóa IP cho"
  },
  {
    "en": "The next script authentication will claim the new IP.",
    "es": "La próxima autenticación del script utilizará la nueva IP.",
    "vi": "Lần xác thực script tiếp theo sẽ ghi nhận IP mới."
  },
  {
    "en": "Spam prevention active.",
    "es": "La prevención de spam está activa.",
    "vi": "Hệ thống chống spam đang kích hoạt."
  },
  {
    "en": "Please wait",
    "es": "Espera",
    "vi": "Vui lòng đợi"
  },
  {
    "en": "Example: Update v2.1 — New feature",
    "es": "Ej: Actualización v2.1 — Nueva feature",
    "vi": "VD: Cập nhật v2.1 — Tính năng mới"
  },
  {
    "en": "Search by @username, email or ID…",
    "es": "Buscar por @usuario, correo o ID…",
    "vi": "Tìm theo @tên_người_dùng, email hoặc ID…"
  },
  {
    "en": "Avatar of",
    "es": "Avatar de",
    "vi": "Ảnh đại diện của"
  },
  {
    "en": "User avatar",
    "es": "Avatar de usuario",
    "vi": "Ảnh đại diện người dùng"
  },
  {
    "en": "Login",
    "es": "Iniciar sesión",
    "vi": "Đăng nhập"
  },
  {
    "en": "Automated submission detected.",
    "es": "Se detectó un envío automatizado.",
    "vi": "Phát hiện gửi yêu cầu tự động."
  },
  {
    "en": "Submission too rapid. Please try again.",
    "es": "El envío fue demasiado rápido. Inténtalo de nuevo.",
    "vi": "Gửi quá nhanh. Vui lòng thử lại."
  },
  {
    "en": "Team member avatar",
    "es": "Avatar del miembro del equipo",
    "vi": "Ảnh đại diện thành viên đội ngũ"
  },
  {
    "en": "CFX AntiDump Security Logo",
    "es": "Logo de seguridad de CFX AntiDump",
    "vi": "Logo bảo mật CFX AntiDump"
  },
  {
    "en": "Initializing...",
    "es": "Inicializando...",
    "vi": "Đang khởi tạo..."
  },
  {
    "en": "Downloading artifact...",
    "es": "Descargando artifact...",
    "vi": "Đang tải artifact..."
  },
  {
    "en": "Extracting files...",
    "es": "Extrayendo archivos...",
    "vi": "Đang giải nén tệp..."
  },
  {
    "en": "Applying resource hiding...",
    "es": "Aplicando ocultación de recursos...",
    "vi": "Đang áp dụng ẩn tài nguyên..."
  },
  {
    "en": "Applying proxy protection...",
    "es": "Aplicando protección del proxy...",
    "vi": "Đang áp dụng bảo vệ proxy..."
  },
  {
    "en": "Running patcher...",
    "es": "Ejecutando el parcheador...",
    "vi": "Đang chạy trình vá..."
  },
  {
    "en": "Compressing results...",
    "es": "Comprimiendo resultados...",
    "vi": "Đang nén kết quả..."
  },
  {
    "en": "Ready for download",
    "es": "Listo para descargar",
    "vi": "Sẵn sàng tải xuống"
  },
  {
    "en": "An internal error occurred while processing the artifact.",
    "es": "Ocurrió un error interno al procesar el artifact.",
    "vi": "Đã xảy ra lỗi nội bộ khi xử lý artifact."
  },
  {
    "en": "Artifact patched successfully! Download starting...",
    "es": "¡Artifact parcheado correctamente! Comenzando la descarga...",
    "vi": "Đã vá artifact thành công! Đang bắt đầu tải xuống..."
  },
  {
    "en": "Error processing artifact",
    "es": "Error al procesar el artifact",
    "vi": "Lỗi khi xử lý artifact"
  },
  {
    "en": "Lost connection to server",
    "es": "Se perdió la conexión con el servidor",
    "vi": "Mất kết nối tới máy chủ"
  },
  {
    "en": "Invalid plan, capacity, project or email",
    "es": "Plan, capacidad, proyecto o correo inválido",
    "vi": "Gói dịch vụ, sức chứa, dự án hoặc email không hợp lệ"
  },
  {
    "en": "Invalid plan or capacity",
    "es": "Plan o capacidad inválidos",
    "vi": "Gói dịch vụ hoặc sức chứa không hợp lệ"
  },
  {
    "en": "Server not found",
    "es": "Servidor no encontrado",
    "vi": "Không tìm thấy máy chủ"
  },
  {
    "en": "Only the owner may assign a plan to this server",
    "es": "Solo el propietario puede asignar el plan al servidor",
    "vi": "Chỉ chủ sở hữu mới có thể gán gói cho máy chủ này"
  },
  {
    "en": "Could not create the order",
    "es": "No se pudo crear la orden",
    "vi": "Không thể tạo đơn hàng"
  },
  {
    "en": "Order not found",
    "es": "Orden no encontrada",
    "vi": "Không tìm thấy đơn hàng"
  },
  {
    "en": "This quote expired; review the price again",
    "es": "La cotización expiró; vuelve a revisar el precio",
    "vi": "Báo giá này đã hết hạn; vui lòng kiểm tra lại giá"
  },
  {
    "en": "Confirm the exact version of the order documents",
    "es": "Confirma la versión exacta de los documentos de la orden",
    "vi": "Vui lòng xác nhận đúng phiên bản tài liệu của đơn hàng"
  },
  {
    "en": "This payment session ended; create a new quote",
    "es": "Esta sesión de pago terminó; crea una nueva cotización",
    "vi": "Phiên thanh toán này đã kết thúc; hãy tạo báo giá mới"
  },
  {
    "en": "This order no longer accepts a new payment",
    "es": "La orden ya no admite un nuevo pago",
    "vi": "Đơn hàng này không còn chấp nhận thanh toán mới"
  },
  {
    "en": "Could not start the order payment",
    "es": "No se pudo iniciar el pago de la orden",
    "vi": "Không thể khởi tạo thanh toán cho đơn hàng"
  },
  {
    "en": "Whitelist",
    "es": "Lista blanca",
    "vi": "Danh sách trắng (Whitelist)"
  },
  {
    "en": "Blacklist",
    "es": "Lista negra",
    "vi": "Danh sách đen (Blacklist)"
  },
  {
    "en": "Ignore",
    "es": "Ignorar",
    "vi": "Bỏ qua"
  },
  {
    "en": "IPs allowed through the filter",
    "es": "Direcciones IP permitidas por el filtro",
    "vi": "Các địa chỉ IP được phép đi qua bộ lọc"
  },
  {
    "en": "IPs to explicitly flag/block",
    "es": "Direcciones IP que se marcan o bloquean",
    "vi": "Các địa chỉ IP bị đánh dấu hoặc chặn"
  },
  {
    "en": "IPs whose events are silently discarded",
    "es": "Direcciones IP cuyos eventos se descartan sin avisar",
    "vi": "Các địa chỉ IP có sự kiện bị bỏ qua âm thầm"
  },
  {
    "en": "selected server",
    "es": "servidor seleccionado",
    "vi": "máy chủ đã chọn"
  },
  {
    "en": "Failed to add filter",
    "es": "No se pudo agregar el filtro",
    "vi": "Thêm bộ lọc thất bại"
  },
  {
    "en": "Filter removed",
    "es": "Filtro eliminado",
    "vi": "Đã xóa bộ lọc"
  },
  {
    "en": "Failed to remove filter",
    "es": "No se pudo eliminar el filtro",
    "vi": "Xóa bộ lọc thất bại"
  },
  {
    "en": "IP added to",
    "es": "IP agregada a",
    "vi": "Đã thêm IP vào"
  },
  {
    "en": "successfully",
    "es": "correctamente",
    "vi": "thành công"
  },
  {
    "en": "Enter X-Debug-Secret to clear logs:",
    "es": "Introduce X-Debug-Secret para borrar los registros:",
    "vi": "Nhập X-Debug-Secret để xóa nhật ký:"
  },
  {
    "en": "Drag to reorder",
    "es": "Arrastra para reordenar",
    "vi": "Kéo thả để sắp xếp"
  },
  {
    "en": "Test Dump Block",
    "es": "Probar bloqueo dump",
    "vi": "Thử chặn Dump"
  }
];

const uiTextLookup = new Map<string, UiTextEntry>();
for (const entry of UI_TEXT_ENTRIES) {
  if (!uiTextLookup.has(entry.en)) uiTextLookup.set(entry.en, entry);
  if (entry.es && !uiTextLookup.has(entry.es)) uiTextLookup.set(entry.es, entry);
  if (entry.vi && !uiTextLookup.has(entry.vi)) uiTextLookup.set(entry.vi, entry);
}

export function lookupUiText(lang: Lang, text: string): string | undefined {
  const entry = uiTextLookup.get(text);
  if (!entry) return undefined;
  return entry[lang] || entry.en;
}
