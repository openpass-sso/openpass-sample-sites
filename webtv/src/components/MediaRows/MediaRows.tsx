import React, { useCallback, useEffect, useMemo } from "react";
import { MovieType, MoviesType } from "@/hooks/GetMediaData.hook";
import { Box, Text, Image } from "@chakra-ui/react";
import { useState } from "react";
import * as Styled from "./styles";

const MEDIA_ROW = "media-row-";

type MediaRowsProps = {
  data: MoviesType;
  onSelection: (data: MovieType) => void;
};

type MediaItemProps = {
  active: boolean;
  posterUrl?: string;
  title?: string;
  index: number;
  onSelectedItem: (index: number) => void;
};

const MediaItem = ({
  active = false,
  posterUrl,
  title,
  index,
  onSelectedItem,
}: MediaItemProps) => {
  return (
    <Styled.MediaRowItem
      tabIndex={index + 1}
      onClick={() => onSelectedItem(index)}
      onFocus={() => onSelectedItem(index)}
      className={`${active ? "active" : ""}`}
    >
      <Image src={posterUrl} alt={title} width={180} height={250} />
    </Styled.MediaRowItem>
  );
};

export const MediaRows = ({ data = {}, onSelection }: MediaRowsProps) => {
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  const MoviesKeys = useMemo(() => {
    const keys = Object.keys(data);
    return keys;
  }, [data]);

  const ChildFocus = useCallback((elementId: string) => {
    const parent = document.getElementById(elementId);

    if (parent) {
      const child = (parent.firstChild || parent.firstElementChild) as any;

      child?.focus();
    }
  }, []);

  useEffect(() => {
    if (!selectedElement) {
      const firstItem = data[MoviesKeys[0]][0];
      setSelectedElement(firstItem || null);
      if (firstItem) {
        onSelection(firstItem);
      }
    }
  }, [MoviesKeys, data, selectedElement, onSelection]);

  useEffect(() => {
    if (document) {
      ChildFocus(`${MEDIA_ROW}${activeRowIndex}`);
    }
  }, [ChildFocus, activeRowIndex]);

  const isActive = useCallback(
    (item: MovieType, activeRow: number) => {
      return selectedElement?.id === item?.id && activeRowIndex === activeRow;
    },
    [activeRowIndex, selectedElement]
  );

  const handleKeyDown = (event: any) => {
    const element = event.target;

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      if (event.key === "ArrowDown") {
        const nextRowId = `${MEDIA_ROW}${activeRowIndex + 1}`;
        ChildFocus(nextRowId);
      }
      if (event.key === "ArrowUp") {
        const prevRowId =
          activeRowIndex !== 0 ? `${MEDIA_ROW}${activeRowIndex - 1}` : "";
        ChildFocus(prevRowId);
      }
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      // event.stopPropagation()

      if (event.key === "ArrowRight" && element?.nextSibling) {
        element?.nextSibling?.focus();
      }

      if (event.key === "ArrowLeft" && element?.previousSibling) {
        element?.previousSibling?.focus();
      }
    }
  };

  return (
    <Box height={"full"} width={"full"} id="MediaRows">
      {MoviesKeys?.map((key, rowIndex) => (
        <Box
          key={key}
          padding={5}
          position={"relative"}
          overflow={"hidden"}
          zIndex={2}
          id={`${key}`}
          onKeyDown={handleKeyDown}
        >
          <Box width={"full"} margin={"30px 0"}>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {key}
            </Text>
          </Box>

          <Box
            width={"full"}
            display={"flex"}
            tabIndex={rowIndex}
            id={`${MEDIA_ROW}${rowIndex}`}
            onKeyDown={handleKeyDown}
            onFocus={() => setActiveRowIndex(rowIndex)}
          >
            {data[key]?.map((item, i) => (
              <MediaItem
                key={item?.id}
                posterUrl={item?.posterUrl}
                title={item?.title}
                index={i}
                active={isActive(data[key][i], rowIndex)}
                onSelectedItem={(index) => {
                  const content = data[key][index] || null;
                  setSelectedElement(content);
                  onSelection(content);
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
