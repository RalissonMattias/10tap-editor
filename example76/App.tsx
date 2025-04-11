import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useRef} from 'react';
import {
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  RichText,
  Toolbar,
  useEditorBridge,
  ColorKeyboard,
  CustomKeyboard,
  DEFAULT_TOOLBAR_ITEMS,
  useKeyboard,
  type EditorBridge,
  useBridgeState,
  TenTapStartKit,
  CoreBridge,
  Images,
} from '@10play/tentap-editor';

export const WithKeyboard = ({}: NativeStackScreenProps<any, any, any>) => {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
    dynamicHeight: true,
    bridgeExtensions: [
      ...TenTapStartKit,
      CoreBridge.configureCSS(`
      * {
          font-family: 'Rubik', sans-serif;
      }
    `),
    ],
  });

  const rootRef = useRef(null);
  const [activeKeyboard, setActiveKeyboard] = React.useState<string>();

  return (
    <SafeAreaView
      style={{...exampleStyles.fullScreen, backgroundColor: 'white'}}
      ref={rootRef}>
      <View style={{...exampleStyles.fullScreen, paddingHorizontal: 12}}>
        <RichText editor={editor} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={exampleStyles.keyboardAvoidingView}>
        <ToolbarWithColor
          editor={editor}
          activeKeyboard={activeKeyboard}
          setActiveKeyboard={setActiveKeyboard}
        />
        <CustomKeyboard
          rootRef={rootRef}
          activeKeyboardID={activeKeyboard}
          setActiveKeyboardID={setActiveKeyboard}
          keyboards={[ColorKeyboard]}
          editor={editor}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface ToolbarWithColorProps {
  editor: EditorBridge;
  activeKeyboard: string | undefined;
  setActiveKeyboard: (id: string | undefined) => void;
}
const ToolbarWithColor = ({
  editor,
  activeKeyboard,
  setActiveKeyboard,
}: ToolbarWithColorProps) => {
  // Get updates of editor state
  const editorState = useBridgeState(editor);

  const {isKeyboardUp: isNativeKeyboardUp} = useKeyboard();
  const customKeyboardOpen = activeKeyboard !== undefined;
  const isKeyboardUp = isNativeKeyboardUp || customKeyboardOpen;

  // Here we make sure not to hide the keyboard if our custom keyboard is visible
  const hideToolbar =
    !isKeyboardUp || (!editorState.isFocused && !customKeyboardOpen);

  return (
    <Toolbar
      editor={editor}
      hidden={hideToolbar}
      items={[
        {
          onPress: () => () => {
            const isActive = activeKeyboard === ColorKeyboard.id;
            if (isActive) editor.focus();
            setActiveKeyboard(isActive ? undefined : ColorKeyboard.id);
          },
          active: () => activeKeyboard === ColorKeyboard.id,
          disabled: () => false,
          image: () => Images.palette,
        },
        ...DEFAULT_TOOLBAR_ITEMS,
      ]}
    />
  );
};

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});

const initialContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum in orci aliquet, faucibus eros sed, porta lectus. Nullam interdum scelerisque sodales. Donec sodales interdum lectus id vestibulum. Nunc egestas nibh vitae suscipit suscipit. Maecenas sit amet ornare elit. Sed quis dignissim mauris. Ut pulvinar sapien vel velit fringilla sagittis. Nulla molestie suscipit felis nec finibus. Duis efficitur risus purus, ac luctus lacus maximus sit amet. Morbi vitae convallis purus, non sodales purus.

In placerat massa id orci dapibus ultrices. Sed laoreet dui orci, sit amet consectetur justo dictum ac. Quisque a dui tincidunt, elementum lorem id, hendrerit dolor. Proin auctor lacus justo. Phasellus in accumsan augue, sed semper augue. Duis in orci nulla. Nunc nisi diam, consectetur ut pulvinar eget, blandit nec orci. Donec consectetur finibus cursus. Proin euismod, ante nec tempus ullamcorper, turpis est sollicitudin lacus, id pharetra turpis metus a sapien. Praesent scelerisque purus nec diam tincidunt congue. Fusce ac posuere libero. In hac habitasse platea dictumst.

Aliquam sed ornare eros, vel pharetra dolor. Donec et neque faucibus, bibendum nulla et, ornare risus. Cras nec ex ut arcu congue eleifend interdum non ante. Nunc ac diam at massa tempus placerat vel ac nunc. Mauris tincidunt sodales augue, at consequat dui volutpat id. Donec vestibulum sit amet diam at tempor. Nulla rutrum tortor ex, sed tincidunt arcu ullamcorper at. Nulla maximus tortor sed gravida pulvinar. Etiam erat dui, auctor vel arcu ut, dignissim hendrerit libero. Cras rhoncus, odio id efficitur ullamcorper, leo nisi condimentum justo, eu tempus augue tortor ut nisi. Donec consectetur tempor nunc, vitae imperdiet lectus porta sed. Nam in efficitur purus. Interdum et malesuada fames ac ante ipsum primis in faucibus.

Vestibulum eu libero nisl. Aliquam vitae elementum metus, at eleifend libero. In posuere euismod nulla nec tincidunt. Nam eget augue nec leo consectetur ultrices. In id erat tristique lacus feugiat mollis quis eget metus. Cras quis tincidunt neque. Ut feugiat dictum feugiat. Nam quam nisl, fermentum quis enim sed, mollis condimentum magna. Nulla interdum pellentesque nisi, quis tincidunt arcu posuere et. Nam et semper sapien, sit amet pretium orci. Aliquam convallis pellentesque erat, eget sollicitudin nunc sodales eget. Phasellus aliquam viverra magna a sollicitudin. Curabitur pretium augue ligula, et accumsan nisi condimentum in.

Aliquam risus lectus, facilisis vitae mauris quis, elementum finibus urna. Mauris laoreet interdum felis sit amet sodales. Sed vulputate lectus quis gravida egestas. Cras sit amet mi ut justo semper congue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque accumsan laoreet lacus, sit amet consectetur nisl porttitor vel. Phasellus volutpat urna id ante malesuada eleifend. Suspendisse non velit non lectus accumsan dignissim a eget sapien. Donec vel turpis est. Quisque vehicula mauris ac neque ullamcorper, sit amet ullamcorper nisi feugiat. Phasellus non lacus felis. Sed felis enim, ultrices eget porttitor non, ultrices sed erat. Morbi dignissim libero sit amet massa faucibus, a euismod magna consectetur. Proin blandit viverra dictum. Vivamus a nisi mauris. Vivamus eu ante diam.`;

export default WithKeyboard;
