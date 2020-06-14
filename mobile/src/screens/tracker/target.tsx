import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, ScrollView, Dimensions, View } from "react-native";
import {
  Layout,
  Text,
  Button,
  Icon,
  Modal,
  Card,
  Input,
} from "@ui-kitten/components";
import { targetsCoordsSelector } from "./store/reducer";
import { CheckBox } from "react-native-elements";
import { ThemeContext } from "../../context/ThemeContextProvider";
import * as eva from "@eva-design/eva";
import { isTimeGreaterThan5min } from "../../utils/date.util";

// TODO:
// Render issue
// Slow render from map to targets component
const style = StyleSheet.create({
  sub: {
    margin: 20,
  },
  input: {
    margin: 10,
  },
  scrollView: {
    width: Dimensions.get("window").width * 0.8,
    marginBottom: 5,
  },
  controlWrapper: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    marginBottom: 15,
  },
  cbDark: {
    backgroundColor: "#222B45",
    borderColor: "#222B45",
  },
  cbWhite: {
    backgroundColor: "#F7F9FC",
    borderColor: "#F7F9FC",
  },
  AddWrapper: {
    display: "flex",
    flexDirection: "row",
  },
  CheckBoxWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activeIcon: {
    height: 20,
    width: 20,
  },
  addInput: {
    width: 200,
  },
});

const MAX_TARGET = 20;

// Icons
const OnlineIcon = (lastUpdate: string) => {
  const activeColor = isTimeGreaterThan5min(lastUpdate) ? "#8F9BB3" : "#24650A";
  return <Icon style={style.activeIcon} fill={activeColor} name="activity" />;
};
const AddIcon = (props: any) => <Icon {...props} name="plus" />;
const TrackIcon = (props: any, newTarget: number) => {
  const activeColor = newTarget > 0 ? "#0D9FA9" : "#24650A";
  return <Icon {...props} fill={activeColor} name="arrowhead-down" />;
};
const RemoveIcon = (props: any, deleteTarget: Array<string>) => {
  const activeColor = deleteTarget.length > 0 ? "#6D363F" : "#8F9BB3";
  return <Icon {...props} fill={activeColor} name="trash-2" />;
};

const AddModal: any = React.memo(
  ({ visible, setNumTargets, hideModalVisible, setNewTarget }) => {
    const [value, setValue] = React.useState("");
    const add = React.useCallback(() => {
      setNewTarget((l: Array<string>) => [...l, ...[value]]);
      hideModalVisible();
      setNumTargets((l: number) => l - 1);
      //TODO:
      // Check duplicates
      // Check adding own id
    }, [value, hideModalVisible, setNewTarget]);
    return (
      <Modal
        style={{
          padding: 24,
          flex: 1,
          justifyContent: "space-around",
          top: Dimensions.get("window").height * 0.2,
        }}
        visible={visible}
        backdropStyle={style.backdrop}
        onBackdropPress={hideModalVisible}
      >
        <Card disabled={true}>
          <Input
            label="Track an ID:"
            style={style.addInput}
            status="basic"
            placeholder="ID"
            value={value}
            onChangeText={setValue}
          />
          <Button onPress={add}>Add</Button>
        </Card>
      </Modal>
    );
  }
);

export default () => {
  const { theme } = React.useContext(ThemeContext);
  const [addVisible, setAddVisible] = React.useState<boolean>(true);
  const [checked, setChecked] = React.useState<Array<boolean>>([]);
  const targetCoords = useSelector(targetsCoordsSelector);
  const [numTargets, setNumTargets] = React.useState(
    MAX_TARGET - targetCoords.length
  );
  const [deleteTarget, setDeleteTargets] = React.useState<Array<string>>([]);
  const [newTargetList, setNewTargetList] = React.useState<Array<string>>([]);

  // Callbacks
  const onCheck = React.useCallback(
    (i: number, name: string) => {
      let newChecked = [];
      newChecked = [...checked];
      newChecked[i] = !checked[i];
      setChecked(newChecked);
      // Add  items to be deleted
      if (newChecked[i]) setDeleteTargets([...deleteTarget, ...[name]]);
      // Remove uncheck items
      else {
        setDeleteTargets((arr: Array<string>) => arr.filter((n) => n !== name));
      }
    },
    [checked, setChecked, setDeleteTargets]
  );
  const onItemUncheck = React.useCallback(
    (props) => RemoveIcon(props, deleteTarget),
    [deleteTarget]
  );
  const showAddModalVisible = React.useCallback(() => setAddVisible(true), []);
  const hideModalVisible = React.useCallback(() => setAddVisible(false), []);

  // create checkboxes of tracked coordinates
  const targetInputs = React.useMemo(() => {
    const inputs = targetCoords.map((l: any, i: number) => {
      const val: boolean = checked[i];
      const cbTheme = theme === eva.dark ? style.cbDark : style.cbWhite;
      return (
        <View style={style.CheckBoxWrapper}>
          <CheckBox
            title={l.name}
            containerStyle={cbTheme}
            key={i}
            checkedIcon="dot-circle-o"
            uncheckedColor="#50515B"
            checkedColor="#6D363F"
            checked={val}
            onPress={() => onCheck(i, l.name)}
          />
          {OnlineIcon(l.lastUpdate)}
        </View>
      );
    });
    return inputs;
  }, [checked, targetCoords, theme]);

  // create new targets
  const newTargets = React.useMemo(() => {
    const inputs = newTargetList.map((name: string, i: number) => (
      // TODO:
      // Deleting new target
      // Adding icon
      <Text key={i}>{name}</Text>
    ));
    return inputs;
  }, [newTargetList]);

  // populate checked items with default values
  useEffect(() => {
    let ch = [];
    for (let i = 0; i < numTargets; i++) {
      ch.push(false);
    }
    setChecked(ch);
  }, [numTargets]);

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/*Upper control remaining and add btn*/}
      <View style={style.AddWrapper}>
        <Text appearance="hint" style={style.sub}>
          Remaining: {numTargets}
        </Text>
        {numTargets > 0 ? (
          <Button
            appearance="ghost"
            onPress={showAddModalVisible}
            accessoryRight={AddIcon}
          />
        ) : null}
      </View>
      {/* Add modal */}
      <AddModal
        visible={addVisible}
        setNumTargets={setNumTargets}
        setNewTarget={setNewTargetList}
        hideModalVisible={hideModalVisible}
      />

      <ScrollView style={style.scrollView}>
        {/* New targets */}
        {newTargets}
        {/* Existing targets */}
        {targetInputs}
      </ScrollView>

      {/* Track and Untrack */}
      <View style={style.controlWrapper}>
        <Button
          appearance="ghost"
          status="basic"
          accessoryRight={(props: any) =>
            TrackIcon(props, newTargetList.length)
          }
        >
          Track
        </Button>
        <Button
          appearance="ghost"
          status="basic"
          accessoryRight={onItemUncheck}
        >
          Untrack
        </Button>
      </View>
    </Layout>
  );
};
