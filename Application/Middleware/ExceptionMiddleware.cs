using System.Net;
using System.Text.Json;
using Application.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Application.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionMiddleware> logger;
        private readonly IHostEnvironment env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            this.next = next;
            this.logger = logger;
            this.env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception exc)
            {
                logger.LogError(exc, exc.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = env.IsDevelopment()? 
                 new AppException(context.Response.StatusCode, exc.Message, exc.StackTrace?.ToString()):
                 new AppException(context.Response.StatusCode, "Server Error");

               var options = new JsonSerializerOptions {PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
               var json = JsonSerializer.Serialize(response, options);

               await context.Response.WriteAsync(json);
            }
        }
    }
}