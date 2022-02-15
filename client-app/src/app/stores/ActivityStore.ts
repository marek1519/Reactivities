import { format } from "date-fns";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { Profile } from "../models/profile";
import { store } from "./Store";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  lodingInitial = true;

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get grouppedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  setLoadinInitial = (state: boolean) => {
    this.lodingInitial = state;
  };

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.setLoadinInitial(true);
    try {
      const activities = await agent.Activities.list();

      activities.forEach((activity) => {
        this.setActivity(activity);
      });
      this.setLoadinInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadinInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadinInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.selectedActivity = activity;
        this.setLoadinInitial(false);
        return activity;
      } catch (er) {
        console.log(er);
        this.setLoadinInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some(
        (a) => a.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }
    activity.date = new Date(activity.date!); //.split("T")[0];

    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.selectedActivity = undefined;
        this.editMode = false;
        this.loading = false;
      });
    } catch (er) {
      console.log(er);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity?.id!);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (x) => x.username !== user?.username
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity!.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  };
}
