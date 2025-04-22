namespace personnel_tracking_api.Extensions
{
    public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger = logger;

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var directoryPath = $@"{Directory.GetCurrentDirectory()}\Logs";
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                string logFilePath = Path.Combine(directoryPath, @"log.txt");

                long maxSizeBytes = 10 * 1024 * 1024; // 10MB olarak ayarlanmış maksimum boyut
                FileInfo logFileInfo = new FileInfo(logFilePath);

                if (logFileInfo.Length > maxSizeBytes)  // Dosyayı boşaltma
                {
                    await File.WriteAllTextAsync(logFilePath, string.Empty);
                }

                // dosyaya yazma işlemi
                await File.AppendAllTextAsync(logFilePath, $"Error: {ex.Message}{Environment.NewLine}" + 
                                          $"Error Time: {DateTime.Now}{Environment.NewLine}" +
                                          $"Request {context.Request.Method}: {context.Request.Path} from {context.Connection.RemoteIpAddress}{Environment.NewLine}" +
                                          $"Stack Trace: {ex.StackTrace}{Environment.NewLine}{Environment.NewLine}{Environment.NewLine}");

                _logger.LogError(ex, "Hata Oluştu");
                _logger.LogInformation($"Request {context.Request.Method}: {context.Request.Path} from {context.Connection.RemoteIpAddress}");
                throw; // throw the exception to be caught by the ASP.NET Core pipeline
            }
        }
    }
}
