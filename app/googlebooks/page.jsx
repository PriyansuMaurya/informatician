"use client";

import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BookComponent() {
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    // Function to fetch book details from Google Books API
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();
        setBookDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!bookDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single-view container-fluid row single">
      <div className="inside-wrapper">
        <div className="left-wrapper-content">
          <h1 className="book-name">{bookDetails.volumeInfo.title}</h1>
          <div className="author">
            <Link href={`/buybooks/author/${bookDetails.volumeInfo.authors[0]}`}>
              Author: {bookDetails.volumeInfo.authors[0]}
            </Link>
          </div>
          <div className="rating">
            <ReactStars count={5} size={24} color2={"#ffd700"} value={4}/>
            {bookDetails.volumeInfo.ratingsCount} Ratings
          </div>
          <div>
            <h2 className="about">About this Book</h2>
            <div>
              <p>
                <strong>{bookDetails.volumeInfo.subtitle}</strong>
              </p>
              {/* Render description with HTML formatting */}
              <div
                dangerouslySetInnerHTML={{
                  __html: bookDetails.volumeInfo.description,
                }}
              />
            </div>
          </div>
          <div className="book-info">
            <p>
              <h3>Language:</h3> {bookDetails.volumeInfo.language}
            </p>
            <p>
              <h3>Publisher:</h3> {bookDetails.volumeInfo.publisher}
            </p>
            <p>
              <h3>Release Date:</h3> {bookDetails.volumeInfo.publishedDate}
            </p>
            <p>
              <h3>ISBN:</h3>{" "}
              {bookDetails.volumeInfo.industryIdentifiers[0].identifier}
            </p>
          </div>
        </div>
        <div className="space"></div>
        <div className="side-panel">
          <div className="thumbnail">
            <Image
              src={bookDetails.volumeInfo.imageLinks.thumbnail}
              alt={bookDetails.volumeInfo.title}
              width={100}
              height={100}
            />
          </div>
          <div className="buttons">
            <Link
              href={{
                pathname: "/sample-component",
                search: `?isbn=${bookDetails.volumeInfo.industryIdentifiers[0].identifier}`,
              }}
              className="btn"
            >
              Sample
            </Link>
          </div>
          <button className="bookmark">
            <div>
              <FontAwesomeIcon icon={faBookmark} />
            </div>
            <div>{"  "}Save for later</div>
          </button>
        </div>
      </div>
    </div>
  );
}
