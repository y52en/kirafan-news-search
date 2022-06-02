import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppTopBar } from "./view/appbar";
import { ResultList } from "./view/ResultList";
import { SearchBox } from "./view/searchBox";
import { news_dl_db } from "./news";
import { useState, useEffect } from "react";
import { news_db,config_db } from "./db";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

const theme = createTheme();
theme.palette.background.default = "#ddd";

export default function Album() {
  const [result, setResult] = useState<[string, string, string][]>([]);
  const [newsData, setNewsData] = useState<[string, string, string][]>([]);
  // 0: init , 1: downloading , 2: downloaded
  const [loading, setLoading] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressSum, setProgressSum] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [LastSearch, setLastSearch] = useState("");
  const [skipped, setSkipped] = useState<string[]>([]);

  useEffect(() => {
    async function main() {
      await news_dl_db((i, sum) => {
        setProgress(i);
        setProgressSum(sum);
        setLoading(1);
      });
      const news_db_ = new news_db();
      const config = new config_db();
      const news_db_list = await news_db_.get_all();
      setNewsData(
        news_db_list.map((x) => {
          return [x.title, x.content, x.link];
        })
      );
      setSkipped((await config.get_db())["skip_list"].map(x => {
        return x.match(/\/(?<id>\d+)\/(?<title>[^/]+)\/index\.html$/)
          ?.groups?.title.replaceAll("／","/") || x;
      }));
      setLoading(2);
    }
    main();
  }, []);

  useEffect(() => {
    async function search() {
      setResult(
        newsData.filter(([title, content, _url]) => {
          if (searchText === "") return false;
          return title.includes(searchText) || content.includes(searchText);
        })
      );
      setLastSearch(String(new Date()));
    }

    search();
  }, [searchText]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppTopBar skipedList={skipped} />
        <main>
          {(() => {
            if (loading === 0) {
              return (
                <ProgressBase>
                  <CircularProgress />
                </ProgressBase>
              );
            } else if (loading === 1) {
              return (
                <>
                  <Grid container>
                    <Grid item xs={12}>
                      <ProgressBase>
                        <CircularProgress
                          variant="determinate"
                          value={(progress / progressSum) * 100}
                        />
                      </ProgressBase>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "10px",
                        }}
                      >
                        {progress}/{progressSum}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              );
            } else if (loading === 2) {
              return (
                // TODO : 別ファイルに分ける
                <>
                  <SearchBox
                    onInputChange={(x) => setSearchText(x)}
                    foundCount={result.length}
                    newsLength={newsData.length}
                    LastSearch={LastSearch}
                  ></SearchBox>
                  <ResultList data={result}></ResultList>
                </>
              );
            }

            return <>error</>;
          })()}
        </main>
      </ThemeProvider>
    </>
  );
}

type Props = {
  children: JSX.Element;
};
function ProgressBase(props: Props): JSX.Element {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40%",
        marginTop: "30px",
      }}
    >
      {props.children}
    </Box>
  );
}
