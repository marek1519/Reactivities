import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";

export default class ActivityStore {
  activityRegistry= new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  lodingInitial = true;

  get activitiesByDate()
  {
    return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
  } 


  setSelectActivity = (id: string) => {
    this.closeForm();
    this.selectedActivity = this.activityRegistry.get(id);
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  openForm = (id?: string) => {
    if (id) {
      this.setSelectActivity(id);
    } else {
      this.cancelSelectedActivity();
    }
    this.editMode = true;
  };

  closeForm = () => {
    this.editMode = false;
  };

  setLoadinInitial = (state: boolean) => {
    this.lodingInitial = state;
  };

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    
    try {
      const activities = await agent.Activities.list();

      activities.forEach((activity) => {
        activity.date = activity.date.split("T")[0];
        this.activityRegistry.set(activity.id, activity);
      });
      this.setLoadinInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadinInitial(false);
    }
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    activity.id = uuid();
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
