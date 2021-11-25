using Domain;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Domain.Activity>>> GetActivities()
    => Ok(await Mediator.Send(new List.Query()));


    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Activity>> GetActivity(Guid id)
    => Ok(await Mediator.Send(new Details.Query { Id = id }));

    [HttpPost]
    public async Task<IActionResult> CreateActivity(Domain.Activity activity)
    => Ok(await Mediator.Send(new Create.Command { Activity = activity }));

    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivity(Guid id, Domain.Activity activity)
    {
        activity.Id = id;
        return Ok(await Mediator.Send(new Edit.Command { Activity = activity }));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    => Ok(await Mediator.Send(new Delete.Command { Id = id }));

}
