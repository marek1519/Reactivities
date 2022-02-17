using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{

    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._photoAccessor = photoAccessor;
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                .Include(p => p.Photos)
                .FirstOrDefaultAsync(p => p.UserName == _userAccessor.GetUserName());
                if (user is null)
                    return null;


                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo is null) return null;

                if (photo.IsMain)
                {
                    return Result<Unit>.Failure("You cannot delete main photo");
                }
                var resApi = _photoAccessor.DeletePhoto(request.Id);
                if(resApi is null) return Result<Unit>.Failure("Problem deleting photo from Cloudinary");

                _context.Photos.Remove(photo);
                var result = await _context.SaveChangesAsync() > 0;
                if (result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from database.");
            }
        }
    }

}
