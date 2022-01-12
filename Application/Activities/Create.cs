using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class ComandValidator : AbstractValidator<Command>
        {
            public ComandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }


            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var _name = _userAccessor.GetUserName();
                var user = await _context.Users.FirstOrDefaultAsync(_ => _.UserName == _name);
                if (user is null)
                    return Result<Unit>.Failure("No user with name " + _name);

                var attendee = new ActivityAttendee
                {
                    AppUserId = user.Id,
                    Activity = request.Activity,
                    IsHost = true
                };
                request.Activity.Attendees.Add(attendee);
                
                _context.Activities.Add(request.Activity);
                var saved = await _context.SaveChangesAsync();
                if (saved > 0)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Faild to create Activity");
            }
        }
    }
}