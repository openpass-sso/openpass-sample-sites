import styled from "@emotion/styled"
import { Box, Text, Image } from "@chakra-ui/react";


export const MediaRowItem = styled(Box)`

  padding: 10px 10px;
  min-width: 190px;
  cursor: pointer;
  outline: none;

  &.active, 
  &:focus{
    border: 3px solid #fefefe;
    border-radius: 10px;
  }

`