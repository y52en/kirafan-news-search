import {  Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
  onInputChange: (text: string) => void;
  foundCount: number;
  newsLength: number;
  LastSearch: string;
};

export function SearchBox(props: Props): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const [showSearchText, setShowSearchText] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    setShowLoading(false);
  }, [props.LastSearch]);
  return (
    <>
      <Card
        sx={{
          height: "100%",
          margin: "10px 10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
        }}
        variant="outlined"
      >
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Grid container>
            <Grid item xs={5}>
              <TextField
                id="input-with-sx"
                label="検索"
                variant="standard"
                sx={{ width: "100%" }}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
            </Grid>
            <Grid sx={{ marginTop: "10px", marginX: 0 }} item xs={3.4}>
              <Button
                variant="outlined"
                startIcon={<Search />}
                sx={{ marginLeft: "10px" }}
                onClick={() => {
                  setShowLoading(showSearchText !== searchText);
                  props.onInputChange(searchText);
                  setShowSearchText(searchText);
                }}
              >
                {showLoading ? "検索中..." : "検索"}
              </Button>
            </Grid>
            <Grid
              sx={{
                paddingTop: "10px",
                alignItems: "right",
                justifyContent: "center",
              }}
              item
              xs={3.6}
            >
              <Typography>
                {showSearchText + " : "}
                {props.foundCount}/{props.newsLength}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </>
  );
}
