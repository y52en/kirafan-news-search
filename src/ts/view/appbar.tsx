import { Info } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  Avatar,
} from "@mui/material";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import favicon from "../../favicon.png";



export function AppTopBar(props:{skipedList:string[]}): JSX.Element {
  return (
    <AppBar position="relative">
      <Toolbar variant="dense">
        {/* <Search sx={{ mr: 2 }} /> */}
        <Avatar sx={{mr:1}} src={favicon}></Avatar>
        <Typography variant="h6" color="inherit" noWrap>
          お知らせ検索ツール
        </Typography>

        <ScrollDialog skipedList={props.skipedList} />
      </Toolbar>
    </AppBar>
  );
}

function PopUp(props: { data: string[] }): JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableBody>
          {props.data.map((x, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell >{x}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ScrollDialog(props: { skipedList: string[] }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Box sx={{ ml: "auto" }}>
      <IconButton
        onClick={handleClickOpen()}
        color="inherit"
        component="span"
      >
        <Info />
      </IconButton>
      <Dialog open={open} onClose={handleClose} scroll="paper">
        <DialogTitle>取得をスキップしたお知らせリスト</DialogTitle>
        <DialogContent dividers>
          <DialogContentText ref={descriptionElementRef} tabIndex={-1}>
            <PopUp data={props.skipedList} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
