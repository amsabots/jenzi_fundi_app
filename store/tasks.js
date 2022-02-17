import _ from 'lodash';

const initialState = {
  jobs: [],
  posted_job: {},
  selected_job: {},
};

const tasks = (state = initialState, action) => {
  let selected;
  const {type, payload} = action;
  switch (type) {
    case 'LOAD_JOBS':
      return {...state, jobs: payload};
    case 'ADD_TASK':
      return {...state, jobs: [...state.jobs, ...payload]};
    case 'REMOVE_TASK':
      selected = state.jobs;
      _.remove(e, e => e.taskId === payload.taskId);
      return {...state, jobs: selected};
    case 'UPDATE_TASK':
      const s_index = _.findIndex(state.jobs, o => o.taskId === payload.taskId);
      if (s_index > -1) {
        console.log('updating job task');
        selected = state.jobs[s_index];
        state.jobs[s_index] = {...selected, ...payload};
      }
      return state;
    case 'SET_SELECTED':
      return {...state, selected_job: payload};
    case 'RESET_TASKS':
      return initialState;
    default:
      return state;
  }
};

export {tasks};
