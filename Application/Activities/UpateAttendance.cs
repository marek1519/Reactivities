using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._context = context;
                this._userAccessor = userAccessor;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                .Include(_ => _.Attendees)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity is null)
                    return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user is null)
                    return null;


                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUserId == user.Id);

                if (attendance is not null && hostUsername == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }
                
                if (attendance is not null && hostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }

                if(attendance is null){
                    attendance=new Domain.ActivityAttendee{
                        AppUser=user,
                        AppUserId = user.Id,
                        ActivityId = activity.Id,
                        IsHost=false
                    };
                    activity.Attendees.Add(attendance);
                }

var result = await _context.SaveChangesAsync()>0;
return result?
               Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating Attendance");

            }
        }
    }
}