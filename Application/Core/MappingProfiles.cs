using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Domain.Activity,Domain.Activity>();
            CreateMap<Domain.Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName))
                .ReverseMap();

            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(p=>p.Username, o=> o.MapFrom(s=> s.AppUser.UserName))
                .ForMember(p=>p.DisplayName, o=> o.MapFrom(s=> s.AppUser.DisplayName))
                .ForMember(p=>p.Bio, o=> o.MapFrom(s=> s.AppUser.Bio))
                
                .ForMember(p=>p.Image, o=> o.MapFrom(s=> s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                
                .ReverseMap();

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            //.ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
            //.ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
            //.ForMember(d => d.Following,
            //    o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ReverseMap();
                
                //.ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                //.ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                //.ForMember(d => d.Following,
                //    o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

                

        }
    }
}