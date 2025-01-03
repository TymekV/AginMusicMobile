import Container from "@lib/components/Container";
import FullscreenMessage from "@lib/components/FullscreenMessage";
import Header from "@lib/components/Header";
import { useTabsHeight } from "@lib/hooks";
import { IconDownload } from "@tabler/icons-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Downloads() {
    const [tabsHeight] = useTabsHeight();

    return (
        <Container includeBottom={false}>
            {/* <Header title="Downloads" subtitle="Downloads feature will be avalibale soon" /> */}
            <View style={{ paddingBottom: tabsHeight, flex: 1, }}>
                <FullscreenMessage
                    icon={IconDownload}
                    label='Downloads'
                    description='Downloads feature will be avalibale soon. Stay tuned!'
                />
            </View>
        </Container>
    )
}