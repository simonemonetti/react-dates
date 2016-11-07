import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import cx from 'classnames';
import Portal from 'react-portal';

import isTouchDevice from '../utils/isTouchDevice';
import getResponsiveContainerStyles from '../utils/getResponsiveContainerStyles';
import toMomentObject from '../utils/toMomentObject';
import toLocalizedDateString from '../utils/toLocalizedDateString';

import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';
import isInclusivelyBeforeDay from '../utils/isInclusivelyBeforeDay';

import DateRangePickerInput from './DateRangePickerInput';
import DayPickerWithModifiers from './DayPickerWithModifiers';

import CloseButton from '../svg/close.svg';

import DateRangePickerShape from '../shapes/DateRangePickerShape';

import {
  START_DATE,
  END_DATE,
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
  ANCHOR_LEFT,
  ANCHOR_RIGHT,
} from '../../constants';

const propTypes = DateRangePickerShape;

const defaultProps = {
  startDateId: START_DATE,
  endDateId: END_DATE,
  focusedInput: null,
  minimumNights: 1,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  enableOutsideDays: false,
  numberOfMonths: 2,
  showClearDates: false,
  disabled: false,
  required: false,
  reopenPickerOnClearDates: false,
  keepOpenOnDateSelect: false,
  initialVisibleMonth: () => moment(),
  navPrev: null,
  navNext: null,

  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,

  onDatesChange() {},
  onFocusChange() {},
  onPrevMonthClick() {},
  onNextMonthClick() {},

  // i18n
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: {
    closeDatePicker: 'Close',
    clearDates: 'Clear Dates',
  },
};

export default class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dayPickerContainerStyles: {},
    };

    this.isTouchDevice = isTouchDevice();

    this.onOutsideClick = this.onOutsideClick.bind(this);

    this.onClearFocus = this.onClearFocus.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onStartDateFocus = this.onStartDateFocus.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onEndDateFocus = this.onEndDateFocus.bind(this);
    this.clearDates = this.clearDates.bind(this);

    this.responsivizePickerPosition = this.responsivizePickerPosition.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.responsivizePickerPosition);
    this.responsivizePickerPosition();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.responsivizePickerPosition);
  }

  onClearFocus() {
    this.props.onFocusChange(null);
  }

  onEndDateChange(endDateString) {
    const {
      startDate,
      isOutsideRange,
      keepOpenOnDateSelect,
      onDatesChange,
      onFocusChange,
    } = this.props;

    const endDate = toMomentObject(endDateString, this.getDisplayFormat());

    const isEndDateValid = endDate && !isOutsideRange(endDate) &&
      !isInclusivelyBeforeDay(endDate, startDate);
    if (isEndDateValid) {
      onDatesChange({ startDate, endDate });
      if (!keepOpenOnDateSelect) onFocusChange(null);
    } else {
      onDatesChange({
        startDate,
        endDate: null,
      });
    }
  }

  onEndDateFocus() {
    const { startDate, onFocusChange, withFullScreenPortal, disabled } = this.props;

    if (!startDate && withFullScreenPortal && !disabled) {
      // When the datepicker is full screen, we never want to focus the end date first
      // because there's no indication that that is the case once the datepicker is open and it
      // might confuse the user
      onFocusChange(START_DATE);
    } else if (!disabled) {
      onFocusChange(END_DATE);
    }
  }

  onOutsideClick() {
    const { focusedInput, onFocusChange } = this.props;
    if (!focusedInput) return;

    onFocusChange(null);
  }

  onStartDateChange(startDateString) {
    const startDate = toMomentObject(startDateString, this.getDisplayFormat());

    let { endDate } = this.props;
    const { isOutsideRange, onDatesChange, onFocusChange } = this.props;
    const isStartDateValid = startDate && !isOutsideRange(startDate);
    if (isStartDateValid) {
      if (isInclusivelyBeforeDay(endDate, startDate)) {
        endDate = null;
      }

      onDatesChange({ startDate, endDate });
      onFocusChange(END_DATE);
    } else {
      onDatesChange({
        startDate: null,
        endDate,
      });
    }
  }

  onStartDateFocus() {
    if (!this.props.disabled) {
      this.props.onFocusChange(START_DATE);
    }
  }

  getDateString(date) {
    const displayFormat = this.getDisplayFormat();
    if (date && displayFormat) {
      return date && date.format(displayFormat);
    }
    return toLocalizedDateString(date);
  }

  getDayPickerContainerClasses() {
    const {
      focusedInput,
      orientation,
      withPortal,
      withFullScreenPortal,
      anchorDirection,
    } = this.props;
    const showDatepicker = focusedInput === START_DATE || focusedInput === END_DATE;

    const dayPickerClassName = cx('DateRangePicker__picker', {
      'DateRangePicker__picker--show': showDatepicker,
      'DateRangePicker__picker--invisible': !showDatepicker,
      'DateRangePicker__picker--direction-left': anchorDirection === ANCHOR_LEFT,
      'DateRangePicker__picker--direction-right': anchorDirection === ANCHOR_RIGHT,
      'DateRangePicker__picker--horizontal': orientation === HORIZONTAL_ORIENTATION,
      'DateRangePicker__picker--vertical': orientation === VERTICAL_ORIENTATION,
      'DateRangePicker__picker--portal': withPortal || withFullScreenPortal,
      'DateRangePicker__picker--full-screen-portal': withFullScreenPortal,
    });

    return dayPickerClassName;
  }

  getDayPickerDOMNode() {
    return ReactDOM.findDOMNode(this.dayPicker);
  }

  getDisplayFormat() {
    const { displayFormat } = this.props;
    return typeof displayFormat === 'string' ? displayFormat : displayFormat();
  }

  clearDates() {
    const { onDatesChange, reopenPickerOnClearDates, onFocusChange } = this.props;
    onDatesChange({ startDate: null, endDate: null });
    if (reopenPickerOnClearDates) {
      onFocusChange(START_DATE);
    }
  }

  responsivizePickerPosition() {
    const { anchorDirection, horizontalMargin } = this.props;
    const { dayPickerContainerStyles } = this.state;

    const isAnchoredLeft = anchorDirection === ANCHOR_LEFT;

    const containerRect = this.dayPickerContainer.getBoundingClientRect();
    const currentOffset = dayPickerContainerStyles[anchorDirection] || 0;
    const containerEdge = isAnchoredLeft ? containerRect[ANCHOR_RIGHT] : containerRect[ANCHOR_LEFT];

    this.setState({
      dayPickerContainerStyles: getResponsiveContainerStyles(
        anchorDirection,
        currentOffset,
        containerEdge,
        horizontalMargin
      ),
    });
  }

  maybeRenderDayPickerWithPortal() {
    const { focusedInput, withPortal, withFullScreenPortal } = this.props;

    if (withPortal || withFullScreenPortal) {
      return (
        <Portal isOpened={focusedInput !== null}>
          {this.renderDayPicker()}
        </Portal>
      );
    }

    return this.renderDayPicker();
  }

  renderDayPicker() {
    const {
      isDayBlocked,
      isOutsideRange,
      numberOfMonths,
      orientation,
      monthFormat,
      navPrev,
      navNext,
      onPrevMonthClick,
      onNextMonthClick,
      onDatesChange,
      onFocusChange,
      withPortal,
      withFullScreenPortal,
      enableOutsideDays,
      initialVisibleMonth,
      focusedInput,
      startDate,
      endDate,
      minimumNights,
      keepOpenOnDateSelect,
    } = this.props;
    const { dayPickerContainerStyles } = this.state;

    const onOutsideClick = !withFullScreenPortal ? this.onOutsideClick : undefined;

    return (
      <div
        ref={ref => { this.dayPickerContainer = ref; }}
        className={this.getDayPickerContainerClasses()}
        style={dayPickerContainerStyles}
      >
        <DayPickerWithModifiers
          ref={ref => { this.dayPicker = ref; }}
          orientation={orientation}
          enableOutsideDays={enableOutsideDays}
          numberOfMonths={numberOfMonths}
          onDayMouseEnter={this.onDayMouseEnter}
          onDayMouseLeave={this.onDayMouseLeave}
          onDayMouseDown={this.onDayClick}
          onDayTouchTap={this.onDayClick}
          onPrevMonthClick={onPrevMonthClick}
          onNextMonthClick={onNextMonthClick}
          onDatesChange={onDatesChange}
          onFocusChange={onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          monthFormat={monthFormat}
          withPortal={withPortal || withFullScreenPortal}
          hidden={!focusedInput}
          initialVisibleMonth={initialVisibleMonth}
          onOutsideClick={onOutsideClick}
          navPrev={navPrev}
          navNext={navNext}
          minimumNights={minimumNights}
          isOutsideRange={isOutsideRange}
          isDayBlocked={isDayBlocked}
          keepOpenOnDateSelect={keepOpenOnDateSelect}
        />

        {withFullScreenPortal &&
          <button
            className="DateRangePicker__close"
            type="button"
            onClick={this.onOutsideClick}
          >
            <span className="screen-reader-only">
              {this.props.phrases.closeDatePicker}
            </span>
            <CloseButton />
          </button>
        }
      </div>
    );
  }

  render() {
    const {
      startDate,
      endDate,
      focusedInput,
      showClearDates,
      disabled,
      required,
      startDateId,
      endDateId,
      phrases,
      withPortal,
      withFullScreenPortal,
    } = this.props;

    const startDateString = this.getDateString(startDate);
    const endDateString = this.getDateString(endDate);

    return (
      <div className="DateRangePicker">
        <DateRangePickerInput
          ref={(ref) => { this.input = ref; }}
          startDateId={startDateId}
          startDatePlaceholderText={this.props.startDatePlaceholderText}
          isStartDateFocused={focusedInput === START_DATE}
          endDateId={endDateId}
          endDatePlaceholderText={this.props.endDatePlaceholderText}
          isEndDateFocused={focusedInput === END_DATE}
          onStartDateChange={this.onStartDateChange}
          onStartDateFocus={this.onStartDateFocus}
          onStartDateShiftTab={this.onClearFocus}
          onEndDateChange={this.onEndDateChange}
          onEndDateFocus={this.onEndDateFocus}
          onEndDateTab={this.onClearFocus}
          startDate={startDateString}
          endDate={endDateString}
          showClearDates={showClearDates}
          onClearDates={this.clearDates}
          disabled={disabled}
          required={required}
          showCaret={!withPortal && !withFullScreenPortal}
          phrases={phrases}
        />

        {this.maybeRenderDayPickerWithPortal()}
      </div>
    );
  }
}

DateRangePicker.propTypes = propTypes;
DateRangePicker.defaultProps = defaultProps;
