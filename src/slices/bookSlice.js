import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../data/apiService";
import { fetchBooks } from "../data/bookApi";

const initialState = {
  books: [],
  readingList: [],
  bookDetail: null,
  loading: null,
  status: null,
};

export const addToReadingList = createAsyncThunk(
  "book/addToReadingList",
  async (book) => {
    const res = await api.post("/favorites", book);
    return res.data;
  }
);

export const getReadingList = createAsyncThunk(
  "book/getReadingList",
  async () => {
    const response = await api.get(`/favorites`);
    return response.data;
  }
);

export const removeBook = createAsyncThunk(
  "book/removeBook",
  async (removedBookId) => {
    const response = await api.delete(`/favorites/${removedBookId}`);
    return response.data;
  }
);
export const getBookDetail = createAsyncThunk(
  "book/getBookDetail",
  async (bookId) => {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  }
);
export const fetchData = createAsyncThunk("book/fetchData", async (props) => {
  const response = await fetchBooks(props);
  return response.data;
});

export const bookSlice = createSlice({
  name: "book",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = null;
        state.loading = false;
        if (action.payload) state.books = action.payload;
        else toast.error("No data available");
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        toast.error("No data available");
      });
    builder
      .addCase(addToReadingList.pending, (state) => {})
      .addCase(addToReadingList.fulfilled, (state, action) => {
        toast.success("The book has been added to the reading list!");
      })
      .addCase(addToReadingList.rejected, (state, action) => {
        toast.error("Cannot add the book to the reading list");
      });
    builder
      .addCase(getReadingList.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getReadingList.fulfilled, (state, action) => {
        state.status = null;
        state.loading = false;
        state.readingList = action.payload;
      })
      .addCase(getReadingList.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        toast.error("Cannot get the list of favorite books");
      });
    builder
      .addCase(removeBook.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeBook.fulfilled, (state, action) => {
        state.status = null;
        toast.success("The book has been removed");
      })
      .addCase(removeBook.rejected, (state, action) => {
        state.status = "failed";
        toast.error("Could not remove the book");
      });
    builder
      .addCase(getBookDetail.pending, (state) => {
        state.status = "pending";
        state.loading = true;
      })
      .addCase(getBookDetail.fulfilled, (state, action) => {
        state.status = null;
        state.loading = false;
        state.bookDetail = action.payload;
      })
      .addCase(getBookDetail.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        toast.error("Fail to get book details");
      });
  },
});

export default bookSlice.reducer;
