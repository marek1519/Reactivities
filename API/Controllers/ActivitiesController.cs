using Domain;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;
public class ActivitiesController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<Domain.Activity>>> GetActivities()
    => HandleResult(await Mediator.Send(new List.Query()));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetActivity(Guid id)
        => HandleResult(await Mediator.Send(new Details.Query { Id = id }));

    [HttpPost]
    public async Task<IActionResult> CreateActivity(Domain.Activity activity)
    => HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));

    [HttpPut("{id}")]
    public async Task<IActionResult> EditActivity(Guid id, Domain.Activity activity)
    {
        activity.Id = id;
        return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteActivity(Guid id)
    => HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
 
    [HttpPost("{id}/attend")]
    public async Task<IActionResult> AttendActivity(Guid id)
    => HandleResult(await Mediator.Send(new UpateAttendance.Command { Id = id }));

}
