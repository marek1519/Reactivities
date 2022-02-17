using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> AddPhoto([FromForm] Add.Command command)
     => HandleResult(await Mediator.Send(command));

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhoto(string id)
         => HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
 
 
    [HttpPost("{id}/setMain")]
    public async Task<IActionResult> SetMainPhoto(string id)
     => HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));

}
