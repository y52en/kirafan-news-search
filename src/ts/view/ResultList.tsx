import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  Card,
  CardContent,
  Divider,
  ListItemButton,
  Typography,
  Box,
} from "@mui/material";

type Props = {
  data: [string, string, string][];
};

// const dbg:

export function ResultList(props: Props): JSX.Element {
  //   const [dbg, setDbg] = React.useState<[string, string][]>([
  //     [
  //       "5/30	かなた、クレアが新登場！期間限定ブライダル召喚",
  //       "5/30	かなた、クレアが新登場！期間限定ブライダル召喚",
  //     ],
  //     [
  //       "5/30	かなた、クレアが新登場！期間限定",
  //       "5/30	かなた、クレアが新登場！期間限定",
  //     ],
  //     ["eee", "fff"]
  // ]);
  // useEffect(async () => {
  // }, []);
  return (
    <>
      <Card
        sx={{
          height: "100%",
          // display: "flex",
          // flexDirection: "column",
          margin: "10px 10px",
        }}
        variant="outlined"
      >
        <CardContent
          sx={{
            paddingBottom: "15px!important",
          }}
        >
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              borderRadius: "5px",
              padding: "0px",
            }}
            dense
          >
            {props.data.map(([primary, secondary, url], i) => (
              <span key={i}>
                {i !== 0 ? <Divider /> : <></>}
                <ListItem
                  sx={
                    {
                      // height: "55px"
                    }
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => {
                      window.open(url, "_blank");
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {primary}
                        </Typography>
                      }
                      secondary={
                        <Box
                          sx={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {secondary}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </span>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {dbg.map(([primary, secondary], i) => (
          <ListItem key={i}>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        ))}
      </List> */}
    </>
  );
}
