import { useQuery } from '@tanstack/react-query';
import wpcom from 'calypso/lib/wp';
import { useSelector } from 'calypso/state';
import { getActiveAgencyId } from 'calypso/state/a8c-for-agencies/agency/selectors';

export default function useFetchScheduleCallLink() {
	const agencyId = useSelector( getActiveAgencyId );

	return useQuery( {
		queryKey: [ 'agency-schedule-call-link', agencyId ],
		queryFn: () =>
			wpcom.req.get( {
				apiNamespace: 'wpcom/v2',
				path: `/agency/${ agencyId }/schedule-call-link`,
			} ),
		enabled: false,
		refetchOnWindowFocus: false,
	} );
}
