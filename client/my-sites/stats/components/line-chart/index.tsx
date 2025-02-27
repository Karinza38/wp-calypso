import { LineChart, ThemeProvider, jetpackTheme } from '@automattic/charts';
import clsx from 'clsx';
import { numberFormat, useTranslate } from 'i18n-calypso';
import { Moment } from 'moment';
import { useMemo } from 'react';
import StatsEmptyState from '../../stats-empty-state';

function StatsLineChart( {
	chartData = [],
	formatTimeTick,
	className,
	height = 400,
	EmptyState = StatsEmptyState,
	zeroBaseline = true,
	fixedDomain = false,
}: {
	chartData: Array< {
		label: string;
		options: object;
		data: Array< { date: Date; value: number } >;
	} >;
	formatTimeTick?: ( value: number ) => string;
	className?: string;
	height?: number;
	moment: Moment;
	EmptyState: typeof StatsEmptyState;
	zeroBaseline?: boolean;
	fixedDomain?: boolean;
} ) {
	const translate = useTranslate();

	const formatTime = formatTimeTick
		? formatTimeTick
		: ( timestamp: number ) => {
				const date = new Date( timestamp );
				return date.toLocaleDateString( undefined, {
					month: 'short',
					day: 'numeric',
				} );
		  };

	const formatValue = ( value: number ) => {
		return value < 100_000
			? value.toFixed( 0 )
			: numberFormat( value, { numberFormatOptions: { notation: 'compact' }, decimals: 1 } );
	};

	const isEmpty = ( chartData?.[ 0 ]?.data || [] ).length === 0;

	const maxValue = useMemo(
		() =>
			Math.max(
				...chartData.map( ( series ) => Math.max( ...series.data.map( ( d ) => d.value ) ) )
			),
		[ chartData ]
	);

	const yScaleType = useMemo( () => {
		if ( chartData.length <= 1 ) {
			return 'linear';
		}

		const maxValues = chartData.map( ( series ) =>
			Math.max( ...series.data.map( ( d ) => d.value ) )
		);
		const [ minMax, maxMax ] = [ Math.min( ...maxValues ), Math.max( ...maxValues ) ];

		// Avoid division by zero
		if ( minMax === 0 ) {
			return 'linear';
		}

		const scacle = maxMax / minMax;
		if ( scacle > 20 && scacle < 200 ) {
			return 'sqrt';
		} else if ( scacle >= 200 ) {
			return 'log';
		}

		return 'linear';
	}, [ chartData ] );

	return (
		<div className={ clsx( 'stats-line-chart', className ) }>
			{ isEmpty && (
				<EmptyState
					headingText={ translate( 'Real-time views' ) }
					infoText={ translate( 'Collecting data… auto-refreshing in a minute…' ) }
				/>
			) }
			{ ! isEmpty && (
				<ThemeProvider theme={ jetpackTheme }>
					<LineChart
						data={ chartData }
						withTooltips
						withGradientFill
						height={ height }
						margin={ {
							left: 15,
							top: 20,
							bottom: 20,
							right: Math.max( formatValue( maxValue ).length * 10, 40 ), //TODO: we should support this from the lib.
						} }
						options={ {
							yScale: {
								type: yScaleType,
								...( fixedDomain && { domain: [ 0, maxValue ] } ),
								zero: zeroBaseline,
							},
							axis: {
								x: {
									tickFormat: formatTime,
								},
								y: {
									orientation: 'right',
									tickFormat: formatValue,
									numTicks: maxValue > 4 ? 4 : 1,
								},
							},
						} }
					/>
				</ThemeProvider>
			) }
		</div>
	);
}

export default StatsLineChart;
