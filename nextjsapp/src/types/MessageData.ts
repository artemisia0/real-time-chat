export default interface MessageData {
	loading?: boolean;
	errorMessage?: string;
	authorUsername: string;
	date: Date;
	contents: string;
	_id: string | undefined;
}

