const RESOLUTION: Record<string, string> = {
  EBS_GP2_TO_GP3:
    "Migrar volumen EBS de GP2 a GP3. Sin downtime: modificar el volumen desde la consola EC2 o con AWS CLI (modify-volume).",
  EC2_UNDERUTILIZED:
    "Aplicar rightsizing: reducir el tipo de instancia o apagarla si no está en uso activo.",
  STOPPED_INSTANCE:
    "Verificar si la instancia puede eliminarse. Si es temporal, crear AMI y terminarla para detener el cobro del volumen EBS.",
  UNATTACHED_VOLUME:
    "Crear snapshot del volumen como respaldo y luego eliminarlo. Los volúmenes desconectados siguen generando costo.",
  CLOUDWATCH_NO_RETENTION:
    "Configurar política de retención en el Log Group (ej. 30 o 90 días) desde CloudWatch > Log Groups > Actions.",
  CLOUDWATCH_HIGH_RETENTION:
    "Reducir el período de retención del Log Group. Evaluar si se necesitan más de 90 días o mover logs a S3 Glacier.",
  CLOUDWATCH_STORAGE_RIGHTSIZING:
    "Revisar los Log Groups con mayor volumen y reducir retención o filtrar qué métricas/logs se envían.",
  LAMBDA_HIGH_MEMORY:
    "Reducir la memoria asignada a la función Lambda. Usar AWS Lambda Power Tuning para encontrar la configuración óptima.",
  LAMBDA_MEMORY_RIGHTSIZING:
    "Ajustar la memoria de la función Lambda al valor óptimo usando la herramienta Lambda Power Tuning.",
  LAMBDA_DEPRECATED_RUNTIME:
    "Actualizar el runtime de la función Lambda a una versión soportada para evitar fin de soporte y posibles vulnerabilidades.",
  RDS_UNDERUTILIZED:
    "Escalar hacia abajo la instancia RDS (instance type) o considerar Aurora Serverless si el uso es intermitente.",
  RDS_GP2_STORAGE:
    "Migrar el almacenamiento RDS de GP2 a GP3 para reducir costo y mejorar IOPS base sin cargo adicional.",
  RDS_MULTI_AZ_DISABLED:
    "Habilitar Multi-AZ en RDS para alta disponibilidad. Si solo es desarrollo, no es necesario.",
  RDS_NOT_ENCRYPTED:
    "Crear un snapshot de la instancia y restaurarla con cifrado habilitado. No se puede cifrar una instancia existente directamente.",
  RDS_NO_BACKUP_RETENTION:
    "Configurar el período de retención de backups automáticos a mínimo 7 días en la configuración de la instancia RDS.",
  RDS_PUBLIC_ACCESS:
    "Desactivar 'Publicly Accessible' en la instancia RDS y acceder a través de VPC o bastion host.",
  DYNAMODB_EMPTY_TABLE:
    "Eliminar la tabla DynamoDB si ya no es necesaria. Si tiene datos archivados, exportarla a S3 antes de borrar.",
  DYNAMODB_PROVISIONED_MODE:
    "Cambiar de Provisioned a On-Demand si el tráfico es impredecible, o ajustar las unidades de capacidad provisionadas.",
  DYNAMODB_PROVISIONED_RIGHTSIZING:
    "Revisar las Read/Write Capacity Units y ajustarlas a los valores reales de consumo para evitar capacidad ociosa.",
  NAT_IDLE_GATEWAY:
    "Eliminar el NAT Gateway si no hay tráfico activo. Verificar que no haya rutas apuntando a él antes de eliminarlo.",
  S3_STORAGE_RIGHTSIZING_REVIEW:
    "Aplicar S3 Intelligent-Tiering o políticas de ciclo de vida para mover objetos fríos a clases de almacenamiento más baratas.",
  EC2_RI:
    "Adquirir Reserved Instances de 1 año para las instancias con uso sostenido. Puede reducir el costo hasta un 40%.",
  RI_UNUSED:
    "Vender las Reserved Instances no utilizadas en el AWS Marketplace o reasignarlas a otras instancias compatibles.",
  LOW_RI_COVERAGE:
    "Aumentar la cobertura de Reserved Instances para los tipos de instancia con mayor uso sostenido.",
  SP_REVIEW:
    "Evaluar la compra de Savings Plans (Compute o EC2) para los workloads con uso predecible y sostenido.",
  ECS_SERVICE_RIGHTSIZING_REVIEW:
    "Revisar los límites de CPU y memoria de las tareas ECS. Reducir las reservas sobredimensionadas.",
  EKS_NODEGROUP_RIGHTSIZING_REVIEW:
    "Ajustar el tipo de instancia y el tamaño del Node Group de EKS según el uso real de los pods.",
  REDSHIFT_UNDERUTILIZED:
    "Pausar el clúster Redshift cuando no esté en uso o migrar a Redshift Serverless para pago por consulta.",
  RIGHTSIZING_OPPORTUNITY:
    "Analizar el uso real del recurso y migrar a un tipo o tamaño inferior que cubra la carga de trabajo.",
  EIP_UNASSOCIATED:
    "Asociar la Elastic IP a una instancia activa o liberarla (Release) si ya no se necesita, para dejar de pagarla por hora.",
  EBS_ORPHANED_SNAPSHOT:
    "Verificar si el snapshot todavía es necesario como respaldo. Si no, eliminarlo para dejar de pagar su almacenamiento.",
  RDS_ORPHANED_SNAPSHOT:
    "Verificar si el snapshot todavía es necesario como respaldo. Si no, eliminarlo para dejar de pagar su almacenamiento.",
  ELB_NO_TARGETS:
    "Eliminar el Load Balancer si ya no está en uso, o registrar target groups/instancias si aún es necesario.",
  ELASTICACHE_NO_BACKUP:
    "Configurar un Snapshot Retention Limit mayor a 0 en el cluster Redis desde la consola de ElastiCache.",
  CLOUDFRONT_PRICE_CLASS_ALL:
    "Cambiar la Price Class de la distribución a 'Solo Norteamérica y Europa' o 'Solo Norteamérica, Europa, Asia y África' si el tráfico no es global.",
  SAGEMAKER_ENDPOINT_ALWAYS_ON:
    "Evaluar migrar el endpoint a Serverless Inference o configurar Auto Scaling si el tráfico de inferencia es intermitente.",
  NOTEBOOK_INSTANCE_RUNNING:
    "Detener la Notebook Instance desde la consola de SageMaker cuando no esté en uso activo.",
  AURORA_NO_BACKUP_RETENTION:
    "Configurar un período de backup retention mayor a 0 días en el cluster Aurora.",
  ROUTE53_UNUSED_ZONE:
    "Verificar si la Hosted Zone sigue en uso. Si no, eliminarla para dejar de pagar el costo mensual fijo.",
  SNS_TOPIC_NO_SUBSCRIPTIONS:
    "Verificar si el topic todavía es utilizado por alguna integración. Si no, eliminarlo.",
  SQS_MESSAGE_RETENTION_HIGH:
    "Revisar si 14 días de retención es necesario para este caso de uso, o reducir el Message Retention Period.",
  KINESIS_EXTENDED_RETENTION:
    "Reducir el período de retención del stream a 24 horas si no se requiere replay histórico de los datos.",
  OPENSEARCH_UNENCRYPTED:
    "Habilitar Encryption at Rest en el dominio. Requiere recrear el dominio, ya que no puede activarse en uno existente sin migración.",
  VM_STOPPED_NOT_DEALLOCATED:
    "Detener la VM con 'Stop (Deallocate)' desde Azure Portal/CLI en vez de apagarla solo desde el sistema operativo, para dejar de pagar el cómputo.",
  STORAGE_PUBLIC_BLOB_ACCESS:
    "Deshabilitar 'Allow Blob public access' a nivel de Storage Account, salvo que exista una razón explícita para exponer contenedores públicamente.",
  STORAGE_HTTPS_NOT_ENFORCED:
    "Habilitar 'Secure transfer required' (HTTPS) en la configuración del Storage Account.",
  SQL_SERVER_PUBLIC_NETWORK_ACCESS:
    "Restringir el acceso de red del SQL Server con reglas de firewall o un Private Endpoint, o deshabilitar el acceso público si no es necesario.",
  SQL_SERVER_TLS_OUTDATED:
    "Actualizar 'Minimum TLS Version' del SQL Server a 1.2 desde Azure Portal (Networking > Connectivity settings).",
  POSTGRESQL_PUBLIC_NETWORK_ACCESS:
    "Restringir el acceso de red del Flexible Server con reglas de firewall/VNet integration, o deshabilitar el acceso público si no es necesario.",
  POSTGRESQL_BACKUP_RETENTION_LOW:
    "Aumentar el período de backup retention a 7 días o más desde la configuración del Flexible Server.",
  MYSQL_PUBLIC_NETWORK_ACCESS:
    "Restringir el acceso de red del Flexible Server con reglas de firewall/VNet integration, o deshabilitar el acceso público si no es necesario.",
  MYSQL_BACKUP_RETENTION_LOW:
    "Aumentar el período de backup retention a 7 días o más desde la configuración del Flexible Server.",
  AKS_LOCAL_ACCOUNTS_ENABLED:
    "Deshabilitar las cuentas locales del clúster ('Disable local accounts') y forzar autenticación vía Azure AD/Entra ID.",
  AKS_AUTOSCALING_DISABLED:
    "Habilitar el cluster autoscaler en los node pools que no lo tengan, para evitar nodos sobreaprovisionados sin uso.",
  APPSERVICE_HTTPS_ONLY_DISABLED:
    "Habilitar 'HTTPS Only' en la configuración del Web App (Settings > TLS/SSL settings).",
  APPSERVICE_STOPPED:
    "Verificar si la Web App detenida sigue siendo necesaria. Si el App Service Plan no tiene otras apps activas, eliminarlo para dejar de pagarlo.",
  FUNCTIONS_HTTPS_ONLY_DISABLED:
    "Habilitar 'HTTPS Only' en la configuración de la Function App (Settings > TLS/SSL settings).",
  FUNCTIONS_STOPPED:
    "Verificar si la Function App detenida sigue siendo necesaria, especialmente si usa un plan Premium o dedicado que factura aunque esté detenida.",
  CONTAINERINSTANCES_PUBLIC_IP_EXPOSED:
    "Verificar si el Container Group necesita IP pública. Si no, usar una IP privada con VNet integration.",
  CONTAINERINSTANCES_RESTART_POLICY_ALWAYS:
    "Revisar si el restart policy 'Always' es intencional. Para jobs puntuales, usar 'OnFailure' o 'Never' evita reinicios y costo indefinido ante una falla.",
  ACR_ADMIN_USER_ENABLED:
    "Deshabilitar el usuario admin del Container Registry y usar identidades de Azure AD/Managed Identity para autenticarse.",
  ACR_PUBLIC_NETWORK_ACCESS:
    "Restringir el acceso de red del Container Registry con Private Endpoint o reglas de firewall si no es necesario.",
  VNET_DDOS_PROTECTION_STANDARD_ENABLED:
    "Revisar si DDoS Protection Standard es realmente necesario, dado su costo fijo mensual elevado. DDoS Protection Basic viene incluido gratis en toda VNet.",
  VNET_NO_SUBNETS:
    "Verificar si la Virtual Network sin subnets sigue siendo necesaria. Si es un recurso huérfano, eliminarla.",
  LOADBALANCER_IDLE_NO_BACKEND:
    "Registrar destinos en los backend pools del Load Balancer, o eliminarlo si ya no está en uso.",
  LOADBALANCER_BASIC_SKU_DEPRECATED:
    "Migrar el Load Balancer de SKU Basic a Standard antes del 30 de septiembre de 2025, fecha en la que Microsoft retira Basic.",
  APPGATEWAY_NO_BACKEND_POOL:
    "Registrar destinos en los backend pools del Application Gateway, o eliminarlo si ya no está en uso.",
  APPGATEWAY_AUTOSCALE_DISABLED:
    "Evaluar migrar a un SKU v2 (Standard_v2/WAF_v2) con autoscaling para pagar solo por la capacidad que realmente se usa.",
  KEYVAULT_PURGE_PROTECTION_DISABLED:
    "Habilitar Purge Protection en el Key Vault (Settings > Purge protection). No se puede deshabilitar una vez activado.",
  KEYVAULT_PUBLIC_NETWORK_ACCESS:
    "Restringir el acceso de red del Key Vault con Private Endpoint o reglas de firewall (Networking > Firewalls and virtual networks).",
  MONITOR_UNLIMITED_DAILY_QUOTA:
    "Configurar un Daily Cap en el Log Analytics Workspace (Usage and estimated costs > Data Cap) para evitar un pico de costo inesperado.",
  MONITOR_RETENTION_HIGH:
    "Reducir el período de retención del Log Analytics Workspace, o evaluar exportar datos antiguos a un Storage Account más económico.",
  COSMOSDB_PUBLIC_NETWORK_ACCESS:
    "Restringir el acceso de red de la cuenta Cosmos DB con Private Endpoint, filtro de VNet o reglas de firewall de IP.",
  COSMOSDB_MULTI_REGION_REVIEW:
    "Revisar si todas las regiones configuradas en la cuenta Cosmos DB son necesarias; cada región adicional multiplica el costo de throughput y almacenamiento.",
  MANAGEDDISK_UNATTACHED:
    "Crear un snapshot del disco como respaldo y luego eliminarlo. Los discos desconectados siguen generando costo.",
  MANAGEDDISK_ZRS_REVIEW:
    "Verificar si la redundancia Zone-Redundant Storage (ZRS) es necesaria para este disco, o si LRS es suficiente y más económico.",
  PUBLICIP_UNASSOCIATED:
    "Asociar la Public IP a un recurso activo o liberarla si ya no se necesita.",
  PUBLICIP_BASIC_SKU_DEPRECATED:
    "Migrar la Public IP de SKU Basic a Standard antes del 30 de septiembre de 2025, fecha en la que Microsoft retira Basic.",
  NATGATEWAY_NO_SUBNETS:
    "Eliminar el NAT Gateway si no hay subnets asociadas y no hay planes de usarlo pronto.",
  NATGATEWAY_NO_PUBLIC_IP:
    "Asignar una IP pública al NAT Gateway para que el tráfico saliente funcione correctamente.",
  FIREWALL_NO_IP_CONFIG:
    "Completar la configuración de IP del Azure Firewall (Public IP + Virtual Network/Hub), o eliminarlo si ya no está en uso.",
  FIREWALL_PREMIUM_TIER_REVIEW:
    "Evaluar si las features Premium (IDPS, inspección TLS) son necesarias, o si el tier Standard es suficiente y más económico.",
  INSTANCE_TERMINATED_REVIEW:
    "Verificar si la instancia Compute Engine detenida sigue siendo necesaria. Los discos persistentes adjuntos se siguen facturando.",
  INSTANCE_NO_LABELS:
    "Agregar labels a la instancia (equipo, entorno, proyecto) para poder atribuir su costo correctamente.",
  DISK_UNATTACHED:
    "Crear una imagen del disco como respaldo y luego eliminarlo. Los discos persistentes sin adjuntar siguen generando costo.",
  DISK_NO_LABELS:
    "Agregar labels al disco (equipo, entorno, proyecto) para poder atribuir su costo correctamente.",
  STATICIP_UNASSOCIATED:
    "Asociar la IP estática a un recurso activo o liberarla si ya no se necesita, para dejar de pagarla.",
  STATICIP_NO_LABELS:
    "Agregar labels a la IP estática para poder atribuir su costo correctamente.",
  VNET_AUTO_SUBNETS_ENABLED:
    "Evaluar migrar la VPC de modo automático a modo personalizado (custom) para controlar qué subredes se crean y en qué regiones.",
  FIREWALL_OPEN_TO_INTERNET:
    "Restringir el rango de origen de la regla de firewall (evitar 0.0.0.0/0) a las IPs/rangos que realmente necesitan acceso.",
  FIREWALL_DISABLED_REVIEW:
    "Eliminar la regla de firewall deshabilitada si ya no es necesaria, para simplificar la configuración de red.",
  LOADBALANCER_NO_BACKEND_SERVICE:
    "Asociar un backend service a la forwarding rule, o eliminarla si ya no está en uso.",
  LOADBALANCER_LEGACY_SCHEME:
    "Evaluar migrar del Network Load Balancer clásico al balanceador moderno (regional/global) para mejor costo y funcionalidad.",
  NATGATEWAY_NO_NAT_IPS:
    "Asignar IPs NAT al router o cambiar a asignación automática (AUTO_ONLY) para que el tráfico saliente funcione correctamente.",
  NATGATEWAY_ALL_SUBNETS:
    "Revisar si Cloud NAT necesita aplicar a todas las subredes/rangos, o si el alcance puede acotarse.",
  BUCKET_PUBLIC_ACCESS_NOT_PREVENTED:
    "Habilitar 'Public Access Prevention' forzado en el bucket de Cloud Storage, salvo que exista una razón explícita para exponerlo públicamente.",
  BUCKET_UNIFORM_ACCESS_DISABLED:
    "Habilitar Uniform Bucket-Level Access en el bucket para simplificar y auditar los permisos de acceso.",
  SQLINSTANCE_PUBLIC_NO_SSL:
    "Exigir SSL/TLS en las conexiones a la instancia Cloud SQL (Connections > Require SSL).",
  SQLINSTANCE_BACKUP_DISABLED:
    "Habilitar backups automáticos en la instancia Cloud SQL (Backups > Automate backups).",
  GKE_AUTOSCALING_DISABLED:
    "Habilitar el autoscaler en los node pools del clúster GKE que no lo tengan, para evitar nodos sobreaprovisionados.",
  GKE_NO_RELEASE_CHANNEL:
    "Inscribir el clúster GKE en un release channel (Rapid/Regular/Stable) para recibir parches de seguridad automáticamente.",
  CLOUDRUN_INGRESS_ALL:
    "Restringir el ingress del servicio Cloud Run a interno o interno+Load Balancer si no requiere tráfico público directo.",
  CLOUDRUN_NO_MAX_INSTANCES:
    "Configurar un límite máximo de instancias en el servicio Cloud Run para evitar escalado descontrolado y costo inesperado.",
  FUNCTIONS_INGRESS_ALL:
    "Restringir el ingress de la Cloud Function (Allow internal traffic only o internal + Cloud Load Balancing) si no requiere acceso público.",
  FUNCTIONS_GEN1_REVIEW:
    "Evaluar migrar la Cloud Function de 1a a 2a generación para mejores límites de escalado y precio.",
  ARTIFACTREGISTRY_LARGE_SIZE_REVIEW:
    "Configurar una política de limpieza (cleanup policy) en el repositorio para eliminar imágenes/artefactos antiguos automáticamente.",
  ARTIFACTREGISTRY_NO_LABELS:
    "Agregar labels al repositorio de Artifact Registry para poder atribuir su costo correctamente.",
  PUBSUB_NO_KMS_ENCRYPTION:
    "Configurar una clave CMEK (Customer-Managed Encryption Key) en el tópico si se requiere control adicional sobre el cifrado.",
  PUBSUB_NO_LABELS:
    "Agregar labels al tópico Pub/Sub para poder atribuir su costo correctamente.",
  REDIS_BASIC_TIER_REVIEW:
    "Evaluar si la instancia Memorystore necesita alta disponibilidad (tier Standard) o si Basic es suficiente.",
  REDIS_NO_AUTH_NETWORK:
    "Configurar explícitamente la red autorizada de la instancia Memorystore.",
  FIRESTORE_DELETE_PROTECTION_DISABLED:
    "Habilitar 'Delete protection' en la base de datos Firestore para evitar una eliminación accidental.",
  FIRESTORE_DATASTORE_MODE_REVIEW:
    "Evaluar migrar la base de datos de modo Datastore (legacy) a modo Native para acceder a nuevas funcionalidades.",
  DNS_DNSSEC_DISABLED:
    "Habilitar DNSSEC en la zona de Cloud DNS para protegerla contra ataques de spoofing/cache poisoning.",
  DNS_PUBLIC_ZONE_REVIEW:
    "Confirmar que la visibilidad pública de la zona DNS es intencional; si no, recrearla como zona privada.",
  FILESTORE_TIER_REVIEW:
    "Confirmar que el tier Enterprise de Filestore es necesario; considerar Basic/Zonal si el caso de uso no requiere sus garantías.",
  FILESTORE_NO_LABELS:
    "Agregar labels a la instancia Filestore para poder atribuir su costo correctamente.",
  KEYRING_GLOBAL_LOCATION_REVIEW:
    "Evaluar crear el key ring en una ubicación regional en vez de global, según requisitos de latencia/residencia de datos.",
  KEYRING_NAME_DEFAULT:
    "Crear un key ring dedicado por servicio/entorno en vez de usar el nombre genérico 'default'.",
  BIGQUERY_NO_TABLE_EXPIRATION:
    "Configurar una expiración por defecto de tablas en el dataset (Details > Default table expiration) para evitar acumulación indefinida de datos.",
  BIGQUERY_NO_PARTITION_EXPIRATION:
    "Configurar una expiración por defecto de particiones en el dataset si las tablas particionadas no necesitan retener datos indefinidamente.",
  CDN_PROFILE_NO_ENDPOINTS:
    "Verificar si el perfil de CDN/Front Door sigue siendo necesario. Si no tiene endpoints activos, eliminarlo para dejar de pagar su tier base.",
  CDN_HTTP_ALLOWED:
    "Restringir el endpoint del CDN a solo HTTPS desde su configuración (deshabilitar 'HTTP allowed').",
  DNS_ZONE_EMPTY:
    "Verificar si la zona DNS sin registros propios sigue siendo necesaria. Si es huérfana, eliminarla.",
  DNS_ZONE_PRIVATE_REVIEW:
    "Confirmar que la zona DNS privada sigue vinculada a las VNets que la necesitan.",
  SERVICEBUS_NAMESPACE_EMPTY:
    "Verificar si el namespace de Service Bus sigue siendo necesario. Si no tiene colas ni topics, eliminarlo.",
  SERVICEBUS_TLS_OUTDATED:
    "Actualizar la versión mínima de TLS del namespace de Service Bus a 1.2.",
  CDNBACKEND_NO_BACKENDS:
    "Verificar si el backend service con Cloud CDN habilitado sigue en uso. Si no tiene backends asociados, eliminarlo.",
  CDNBACKEND_CACHE_MODE_REVIEW:
    "Evaluar un modo de cache más agresivo (CACHE_ALL_STATIC) para reducir el tráfico al origen.",
  LOGGING_RETENTION_HIGH:
    "Reducir la retención del log bucket o exportar los datos antiguos a Cloud Storage.",
  LOGGING_BUCKET_NOT_LOCKED:
    "Habilitar el 'lock' de retención del log bucket para evitar que se reduzca accidentalmente.",
  SNAPSHOT_ORPHANED:
    "Verificar si el snapshot todavía es necesario como respaldo. Si el disco de origen ya no existe, eliminarlo para dejar de pagar su almacenamiento.",
};

export default RESOLUTION;
