import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, ShieldCheck } from 'lucide-react-native';
import { router } from 'expo-router';

type Props = {
	name?: string;
};

export default function AdminHeader({
	name = 'Administrator',
}: Props) {
	const initials = name
		.split(' ')
		.map((word) => word.charAt(0))
		.join('')
	.slice(0, 2)
	.toUpperCase();

	return (
		<View style={styles.container}>
			<View style={styles.left}>
				<View style={styles.badge}>
					<ShieldCheck
						size={13}
						color="#EF5622"
						strokeWidth={2.5}
					/>

					<Text style={styles.badgeText}>
						ADMINISTRATOR
					</Text>
				</View>

				<Text style={styles.title}>
					Sunrise Towers
				</Text>

				<Text style={styles.subtitle}>
					Building management overview
				</Text>
			</View>

			<Pressable
				onPress={() => router.push('/admin/profile')}
				style={({ pressed }) => [
					styles.profileButton,
					pressed && styles.pressed,
				]}
			>
				<Text style={styles.initials}>
					{initials}
				</Text>

				<View style={styles.chevron}>
					<ChevronRight
						size={12}
						color="#232466"
						strokeWidth={2.5}
					/>
				</View>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 26,
	},

	left: {
		flex: 1,
		paddingRight: 16,
	},

	badge: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		paddingHorizontal: 9,
		paddingVertical: 5,
		borderRadius: 7,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	badgeText: {
		marginLeft: 5,
		fontSize: 9,
		fontWeight: '800',
		letterSpacing: 0.7,
		color: '#232466',
	},

	title: {
		marginTop: 10,
		fontSize: 27,
		fontWeight: '800',
		letterSpacing: -0.8,
		color: '#232466',
	},

	subtitle: {
		marginTop: 4,
		fontSize: 13,
		color: '#232466',
		opacity: 0.65,
	},

	profileButton: {
		width: 48,
		height: 48,
		marginTop: 3,
		marginLeft: 8,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 16,
		backgroundColor: '#232466',
	},

	initials: {
		fontSize: 15,
		fontWeight: '800',
		letterSpacing: 0.4,
		color: '#FFFFFF',
	},

	chevron: {
		position: 'absolute',
		right: -4,
		bottom: -4,
		width: 18,
		height: 18,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 9,
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#EF5622',
	},

	pressed: {
		opacity: 0.7,
	},
});