using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Details
{
    public class Query : IRequest<Result<Profile>>
    {
        public string UserName { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Profile>>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public Handler(DataContext context, IMapper mapper)
        {
            this._context = context;
            this._mapper = mapper;

        }
        public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
            .ProjectTo<Profile>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(p => p.Username == request.UserName);

            if (user is null) return null;

            return Result<Profile>.Success(user);
        }
    }
}