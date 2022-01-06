using API.DTOs;
using API.Tests.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace API.Tests.Controllers
{
    public class AccountControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private HttpClient _client;

        public AccountControllerTests(WebApplicationFactory<Startup> factory)
        {
            _client = factory
                  .WithWebHostBuilder(builder =>
                  {
                      builder.ConfigureServices(services =>
                      {
                          var dbContextOptions = services
                              .SingleOrDefault(service => service.ServiceType == typeof(DbContextOptions<DataContext>));

                          services.Remove(dbContextOptions);

                          //services.AddSingleton<IAccountService>(_accountServiceMock.Object);


                          services
                           .AddDbContext<DataContext>(options => options.UseInMemoryDatabase("ReactivitiesDb"));

                      });
                  })
                .CreateClient();
        }

        [Fact]
        public async Task Login_WithCorrectPassowrd_ReturnsUser()
        {
            var loginDto = new LoginDto
            {
                Email = "bob@test.com",
                Password = "Pa$$w0rd"
            };

            var httpContent = loginDto.ToJsonHttpContent();


            // act

            var response = await _client.PostAsync("/api/account/login", httpContent);

            // assert

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.OK);
        }
        
        [Fact]
        public async Task Login_WithInCorrectPassowrd_ReturnsUnathorized()
        {
            var loginDto = new LoginDto
            {
                Email = "bob@test.com",
                Password = "password123"
            };

            var httpContent = loginDto.ToJsonHttpContent();


            // act

            var response = await _client.PostAsync("/api/account/login", httpContent);

            // assert

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }
        
        [Fact]
        public async Task Login_WithInCorrectEmail_ReturnsUnathorized()
        {
            var loginDto = new LoginDto
            {
                Email = "bob@test.pl",
                Password = "Passw0rd"
            };

            var httpContent = loginDto.ToJsonHttpContent();


            // act

            var response = await _client.PostAsync("/api/account/login", httpContent);

            // assert

            response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
        }


    }
}
