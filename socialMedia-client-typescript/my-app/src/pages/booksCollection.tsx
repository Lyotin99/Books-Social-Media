import axios from "axios";
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { Button, Card, CircularProgress } from "@material-ui/core";
import NoBookCoverImg from "../photos/NoBookCover.jpg";
class booksCollection extends Component {
  state = {
    searchBar: "",
    books: [],
    reviewedBooksPaperback: [],
    reviewedBooksNonFictional: [],
    reviewedBooksFictional: [],
    bookSearchFilter: "",
    filterData: "",
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeSearch = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ bookSearchFilter: event.target.value as string });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.searchBar.trim() !== "")
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes?q=+${this.state.filterData}:${this.state.searchBar}&printType=books&maxResults=40`
        )
        .then((res) => {
          this.setState({
            books: res.data.items,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };

  componentDidMount() {
    let apiKey = "QyzWBJom9uRSHkNkVZvMT5xLnnjRqPgV";
    fetch(
      "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?&api-key=" +
        apiKey,
      { method: "get" }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.results)
          this.setState({
            reviewedBooksFictional: json.results.books,
          });
      });
    fetch(
      "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-nonfiction.json?&api-key=" +
        apiKey,
      { method: "get" }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.results)
          this.setState({
            reviewedBooksNonFictional: json.results.books,
          });
      });
    fetch(
      "https://api.nytimes.com/svc/books/v3/lists/current/paperback-nonfiction.json?&api-key=" +
        apiKey,
      { method: "get" }
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json.results)
          this.setState({
            reviewedBooksPaperback: json.results.books,
          });
      });
  }

  NYTimes = (
    index: number,
    book_image: string,
    title: string,
    author: string,
    rank: number,
    rank_last_week: number,
    weeks_on_list: number,
    description: string
  ) => {
    return (
      <Grid
        item
        xs={12}
        key={index}
        style={{
          padding: 10,
          margin: 10,
        }}
      >
        <Grid container spacing={5} style={{ minHeight: 250 }}>
          <Card
            style={{
              position: "relative",
              marginBottom: 20,
              padding: 10,
              height: 500,
            }}
          >
            <div
              style={{
                width: "45%",
                margin: "0 auto",
              }}
            >
              <img
                src={book_image}
                alt="No cover"
                style={{
                  width: "100%",
                  height: 250,
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                margin: "10px",
              }}
            >
              <p>
                <b>Title: </b> {title}
              </p>
              <div>
                <b>Authors: </b>
                {author}
              </div>

              <p>
                <b>Rank: </b> {rank}
              </p>
              <p>
                <b>Rank last week: </b>{" "}
                {rank_last_week !== 0 ? rank_last_week : "N/A"}
              </p>
              <p>
                <b>Weeks on the list: </b> {weeks_on_list}
              </p>
              <p>
                <b>Description: </b> {description}
              </p>
            </div>
          </Card>
        </Grid>
      </Grid>
    );
  };

  render() {
    const reviewedBooksMarkup = this.state.reviewedBooksFictional.map(
      (book: any, index) => {
        const {
          book_image,
          author,
          description,
          rank,
          rank_last_week,
          weeks_on_list,
          title,
        } = book;

        return this.NYTimes(
          index,
          book_image,
          title,
          author,
          rank,
          rank_last_week,
          weeks_on_list,
          description
        );
      }
    );
    const reviewedBooksNonFictional = this.state.reviewedBooksNonFictional.map(
      (book: any, index) => {
        const {
          book_image,
          author,
          description,
          rank,
          rank_last_week,
          weeks_on_list,
          title,
        } = book;

        return this.NYTimes(
          index,
          book_image,
          title,
          author,
          rank,
          rank_last_week,
          weeks_on_list,
          description
        );
      }
    );
    const reviewedBooksPaperback = this.state.reviewedBooksPaperback.map(
      (book: any, index) => {
        const {
          book_image,
          author,
          description,
          rank,
          rank_last_week,
          weeks_on_list,
          title,
        } = book;

        return this.NYTimes(
          index,
          book_image,
          title,
          author,
          rank,
          rank_last_week,
          weeks_on_list,
          description
        );
      }
    );

    const booksMarkup = this.state.books.map((book: any) => {
      const { volumeInfo } = book;

      return (
        <Grid
          item
          xs={12}
          style={{
            padding: 10,
            margin: 10,
          }}
          key={book.id}
        >
          <Grid container spacing={4} style={{ minHeight: 250 }}>
            <Card
              style={{
                position: "relative",
                display: "flex",
                marginBottom: 20,
                width: "100%",
              }}
            >
              <div>
                {book.volumeInfo.imageLinks ? (
                  <a
                    href={volumeInfo.previewLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt="No cover"
                      style={{
                        width: 150,
                        height: 250,
                        objectFit: "contain",
                      }}
                    />
                  </a>
                ) : (
                  <a
                    href={volumeInfo.previewLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={NoBookCoverImg}
                      alt="No cover"
                      style={{
                        width: 150,
                        height: 250,
                      }}
                    />
                  </a>
                )}
              </div>

              <div style={{ width: "70%", marginLeft: 50 }}>
                <div></div>
                <p>
                  {" "}
                  <b>Title: </b> {volumeInfo.title}
                </p>
                <div>
                  <b>Authors: </b>
                  {volumeInfo.authors
                    ? volumeInfo.authors.join()
                    : "No authors found"}
                </div>
                <p>
                  <b>Category: </b>
                  {volumeInfo.categories
                    ? volumeInfo.categories
                    : "No category"}
                </p>

                <p>
                  {" "}
                  <b>Published: </b>
                  {volumeInfo.publishedDate
                    ? volumeInfo.publishedDate
                    : "No published date found"}
                </p>

                <p>
                  <b>Number of pages: </b>
                  {volumeInfo.pageCount
                    ? volumeInfo.pageCount
                    : "No page count available"}
                </p>
                <p>
                  <b>Description: </b>{" "}
                  {volumeInfo.description
                    ? volumeInfo.description.trim()
                    : "No description available"}
                </p>
              </div>
            </Card>
          </Grid>
        </Grid>
      );
    });
    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
          style={{ width: "70%", margin: "0 auto", paddingTop: 30 }}
        >
          <TextField
            id="filled-full-width"
            label="Label"
            name="searchBar"
            style={{ margin: 8 }}
            placeholder="Search for book titles"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={this.handleChange}
            variant="standard"
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            id="btn"
            type="submit"
            style={{
              marginBottom: 60,
            }}
          >
            Submit
          </Button>
        </form>

        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "60%",
              margin: "0 auto",
              fontSize: "0.9rem",
            }}
          >
            {booksMarkup}
          </div>
          {reviewedBooksMarkup.length > 0 &&
          reviewedBooksNonFictional.length > 0 &&
          reviewedBooksPaperback.length > 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ width: "25%" }}>
                <h2 style={{ fontSize: "1.4rem" }}>Hardcover Fiction:</h2>
                {reviewedBooksMarkup}
              </div>

              <div style={{ width: "25%" }}>
                <h2 style={{ fontSize: "1.4rem" }}>Hardcover non-fiction: </h2>
                {reviewedBooksNonFictional}
              </div>

              <div style={{ width: "25%" }}>
                <h2 style={{ fontSize: "1.4rem" }}>Paperback non-fictional</h2>
                {reviewedBooksPaperback}
              </div>
            </div>
          ) : (
            <CircularProgress size={200} style={{ margin: "0 auto" }} />
          )}
        </Grid>
      </div>
    );
  }
}

export default booksCollection;
