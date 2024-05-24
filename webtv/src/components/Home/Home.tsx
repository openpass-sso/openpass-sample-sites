import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import Header from "../Header/Header";
import { MovieType, UseGetMediaData } from "@/hooks/GetMediaData.hook";
import { MediaRows } from "../MediaRows/MediaRows";
import { MediaDescription } from "../MediaDescription/MediaDescription";
import { useEffect, useState } from "react";

const Home = () => {
  const { movies } = UseGetMediaData();

  const [selection, setSelection] = useState<MovieType | null>(null);

  return (
    <>
      <Box
        minHeight={"full"}
        bgGradient="linear(to-b, #142227, #1E373F)"
        color={"white"}
        p={10}
      >
        {selection?.backdropURL && (
          <Image
            src={selection?.backdropURL || ""}
            alt={selection?.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "82%",
              zIndex: 1,
              opacity: "0.6",
              objectFit: "cover",
            }}
          />
        )}
        <Header />
        <MediaDescription
          title={selection?.title || ""}
          description={selection?.description || ""}
          rating={selection?.rating || null}
        />
        <MediaRows
          data={movies}
          onSelection={(data) => {
            setSelection(data);
          }}
        />
      </Box>
    </>
  );
};

export default Home;
