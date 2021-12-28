using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{
    private IMediator _mediator;
    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<IMediator>();


    protected ActionResult HandleResult<T>(Result<T> result)
    {
        if(result is null) return NotFound();
        if (result.IsSuccess && result.Value is not null)
            return Ok(result.Value);
        else if (result.IsSuccess && result.Value is null)
            return NotFound();
        return BadRequest(result.Error);
    }
}
