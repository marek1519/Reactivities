import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  lodingInitial = true;

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
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
    if (activity) {this.selectedActivity = activity;
    return activity;
    }
    else {
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
    activity.date = activity.date.split("T")[0];
    this.activityRegistry.set(activity.id, activity);
  };

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
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

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
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
}
