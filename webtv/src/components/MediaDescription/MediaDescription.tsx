import { Box, Text, background } from "@chakra-ui/react";
import { useMemo } from "react";

type MediaDescriptionProps = {
  title: string;
  description: string;
  rating: number | string | null;
};

export const MediaDescription = ({
  title,
  description,
  rating,
}: MediaDescriptionProps) => {
  const FormattedTitle = useMemo(() => {
    let _title = title || "";

    if (rating) {
      _title += ` | ${rating}`;
    }

    return _title;
  }, [rating, title]);

  return (
    <Box padding={15} position={"relative"} zIndex={2} minHeight={300}>
      <Text fontSize={"3xl"} fontWeight={"bold"} margin={"35px 0"}>
        {FormattedTitle}
      </Text>

      <Text as={"p"} fontSize={"2xl"}>
        {description}
      </Text>
    </Box>
  );
};
