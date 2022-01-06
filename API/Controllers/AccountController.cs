using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers;


[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly TokenService _tokenService;
    public AccountController(TokenService tokenService, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
    {
        this._tokenService = tokenService;
        this._signInManager = signInManager;
        this._userManager = userManager;

    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user is null)
            return Unauthorized($"User with given email '{loginDto.Email}' didn't exist.");// BadRequest("User with given email didn't exist.");

        var cresult = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (result.Succeeded)
        {
            return CreateUserDto(user);
        }

        return Unauthorized(!cresult ? $"{user.DisplayName} - please check password." : "");
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email taken");
            return ValidationProblem(ModelState);
        }

        if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
         {
            ModelState.AddModelError("username", "Username taken");
            return ValidationProblem(ModelState);
        }

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Username
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (result.Succeeded)
        {
            return CreateUserDto(user);
        }

        return BadRequest(result.Errors.FirstOrDefault() is null ? "" :
            "" + result.Errors.FirstOrDefault().Description);
    }

    private ActionResult<UserDto> CreateUserDto(AppUser user)
    {
        return new UserDto
        {
            DisplayName = user.DisplayName,
            Image = null,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
        return CreateUserDto(user);
    }
}
