/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
/* Set options for Highcharts globally */

const atviseDefaults = {
  global: {
    useUTC: false
  },
  boost: {
    enabled: true
  },
  plotOptions: {
    // series: {
    // turboThreshold: 0,
    // boostThreshold: 1000
    // },
    line: {
      type: 'line'
    }
  },
  title: {
    text: ''
  },
  subtitle: {
    text: ''
  },
  /* The highcharts-objectdisplay is overwriting the predefined atviseOptions */
  atviseOptions: {
    mode: 'mixed',
    source: 'atvise',
    sourceOptions: '{}',
    liveModeFrameRate: 20 // [1 ... 60]fps
  },
  legend: {
    enabled: true
  },
  credits: {
    enabled: false
  },
  chart: {
    // backgroundColor: 'transparent',
    alignTicks: false,
    events: {
      redraw () { try { this._setRedrawComplete() } catch (ex) { } }
    },
    panning: true,
    panKey: 'shift',
    style: {
      fontFamily: 'Arial'
    },
    zoomType: 'x'
  },
  /* Highcharts default is to generate documents on a highcharts server. this requires an internet connection	    */
  /* -- fallbackToExportServer: true, this will allow the fallback to the highchart server        			    */
  /*							  false, this will prevent the connection									        */
  /* -- libURL: some browser can use local libraries to generate the documents (firefox and chrome)               */
  /*            these browser will have a look at these path (default: /highcharts/lib/)						    */
  /* please note: the list of current browsers supporting highchart exports can be requested through our support. */
  exporting: {
    buttons: {
      contextButton: {
        width: 28,
        height: 28,
        symbolSize: 23
      }
    },
    fallbackToExportServer: false,
    libURL: '/highcharts/lib/'
  },
  tooltip: {
    shared: true,
    split: true,
    followTouchMove: false,
    formatter () {
      // The first returned item is the header, subsequent items are the
      // points
      return ['<b>' + new Date(this.x).toLocaleString() + '</b>'].concat(
        this.points
          ? this.points.map(function (point) {
            const decimals = point.series.tooltipOptions.valueDecimals || 2
            const value = point.y.toFixed(2)
            return point.series.name + ': ' + value + (point.series.tooltipOptions.valueSuffix || '')
          })
          : []
      )
    }
    /* formatter: function() {
			var dateFormat = '%H:%M:%S.%L';
			if (this.point.id && this.point.id.indexOf("rightNonStopPoint") > -1) {
				dateFormat = '%H:%M:%S';
			}

			var pointKey= this.point.key ? this.point.key : this.point.x;
			var header = '<span style="font-size: 10px">' + Highcharts.dateFormat(dateFormat, pointKey) + '</span><br/>';

			var prefix = "", suffix = "", value = this.point.y;
			if(this.series.options.tooltip) {
				prefix = this.series.options.tooltip.valuePrefix ? this.series.options.tooltip.valuePrefix : "";
				suffix = this.series.options.tooltip.valueSuffix ? this.series.options.tooltip.valueSuffix : "";
				value = this.series.options.tooltip.valueDecimals ? this.point.y.toFixed(this.series.options.tooltip.valueDecimals): this.point.y;
			}
			var text =  '<span style="color:' + this.series.color +	'">\u25CF</span>' + this.series.name + ': <b>' + prefix + value + suffix + '</b><br/>';
			return header+text;
		} */
  },
  xAxis: {
    events: {
      setExtremes () { try { this.chart._setExtremesComplete() } catch (ex) { } }
    }
  },
  yAxis: {
    autoscale: true,
    startOnTick: false,
    endOnTick: false,
    lineColor: '#CCD6EB',
    lineWidth: 1
  }
}

if (!webMI.getClientInfo().isDesktop) {
  atviseDefaults.navigation = {
    menuStyle: { height: '200px', overflow: 'auto' }
  }
}

top.webMI.libraryLoader.load(['highcharts/themes/dark.js'], [])
