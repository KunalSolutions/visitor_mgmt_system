import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UserPlus, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function RegisterVisitorButton() {
	return (
		<Pressable
			onPress={() => router.push('/security/create-visitor')}
			style={({ pressed }) => [
				styles.container,
				pressed && styles.pressed,
			]}
		>
			<View style={styles.iconContainer}>
				<UserPlus
					size={22}
					color="#FFFFFF"
					strokeWidth={2.2}
				/>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>
					Register Visitor
				</Text>

				<Text style={styles.subtitle}>
					Create a new visitor entry
				</Text>
			</View>

			<View style={styles.arrow}>
				<ChevronRight
					size={20}
					color="#232466"
					strokeWidth={2.2}
				/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#232466',
	},

	iconContainer: {
		width: 46,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 13,
		backgroundColor: '#232466',
	},

	content: {
		flex: 1,
		marginLeft: 14,
	},

	title: {
		fontSize: 16,
		fontWeight: '800',
		color: '#232466',
	},

	subtitle: {
		marginTop: 4,
		fontSize: 12,
		color: '#64748B',
	},

	arrow: {
		width: 34,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 17,
		backgroundColor: '#FFF1EC',
	},

	pressed: {
		opacity: 0.7,
	},
});