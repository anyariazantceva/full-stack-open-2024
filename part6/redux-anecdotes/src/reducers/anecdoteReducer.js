/* eslint-disable no-case-declarations */
import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteForAnecdote(state, action) {
      const updated = action.payload;
      return state.map((a) => (a.id !== updated.id ? a : updated));
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteForAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll();
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const increaseVote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdotesService.addVote({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    dispatch(voteForAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer