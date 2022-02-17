export const task_actions = {
  load_jobs: function (jobs_array) {
    return {
      type: 'LOAD_JOBS',
      payload: jobs_array,
    };
  },
  update_job: function (job_item) {
    return {
      type: 'UPDATE_TASK',
      payload: job_item,
    };
  },
  delete_job: function (job_item) {
    return {
      type: 'REMOVE_TASK',
      payload: job_item,
    };
  },
  add_job_entry: function (job_item) {
    return {
      type: 'ADD_TASK',
      payload: job_item,
    };
  },
  //SET_SELECTED
  set_selected_job: function (job_item) {
    return {
      type: 'SET_SELECTED',
      payload: job_item,
    };
  },
  reset_store: function () {
    return {
      type: 'RESET_TASKS',
    };
  },
};
