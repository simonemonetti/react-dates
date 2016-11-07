import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon-sandbox';
import { shallow } from 'enzyme';
import Portal from 'react-portal';

import DateRangePicker from '../../src/components/DateRangePicker';

import DateRangePickerInput from '../../src/components/DateRangePickerInput';
import DayPickerWithModifiers from '../../src/components/DayPickerWithModifiers';

import isSameDay from '../../src/utils/isSameDay';

import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
  START_DATE,
  END_DATE,
  ANCHOR_LEFT,
  ANCHOR_RIGHT,
} from '../../constants';

const today = moment().startOf('day');

describe('DateRangePicker', () => {
  describe('#render()', () => {
    it('has .DateRangePicker class', () => {
      const wrapper = shallow(<DateRangePicker />);
      expect(wrapper.find('.DateRangePicker')).to.have.length(1);
    });

    it('renders .DateRangePicker__picker class', () => {
      const wrapper = shallow(<DateRangePicker />);
      expect(wrapper.find('.DateRangePicker__picker')).to.have.length(1);
    });

    it('renders <DateRangePickerInput />', () => {
      const wrapper = shallow(<DateRangePicker />);
      expect(wrapper.find(DateRangePickerInput)).to.have.length(1);
    });

    it('renders <DayPickerWithModifiers />', () => {
      const wrapper = shallow(<DateRangePicker />);
      expect(wrapper.find(DayPickerWithModifiers)).to.have.length(1);
    });

    describe('props.orientation === VERTICAL_ORIENTATION', () => {
      it('renders .DateRangePicker__picker--vertical class', () => {
        const wrapper = shallow(<DateRangePicker orientation={VERTICAL_ORIENTATION} />);
        expect(wrapper.find('.DateRangePicker__picker--vertical')).to.have.length(1);
      });
    });

    describe('props.orientation === HORIZONTAL_ORIENTATION', () => {
      it('renders .DateRangePicker__picker--horizontal class', () => {
        const wrapper = shallow(<DateRangePicker orientation={HORIZONTAL_ORIENTATION} />);
        expect(wrapper.find('.DateRangePicker__picker--horizontal')).to.have.length(1);
      });

      it('renders <DayPickerWithModifiers /> with props.numberOfMonths === 2', () => {
        const wrapper = shallow(<DateRangePicker orientation={HORIZONTAL_ORIENTATION} />);
        expect(wrapper.find(DayPickerWithModifiers).props().numberOfMonths).to.equal(2);
      });
    });

    describe('props.anchorDirection === ANCHOR_LEFT', () => {
      it('renders .DateRangePicker__picker--direction-left class', () => {
        const wrapper = shallow(<DateRangePicker anchorDirection={ANCHOR_LEFT} />);
        expect(wrapper.find('.DateRangePicker__picker--direction-left')).to.have.length(1);
      });
    });

    describe('props.orientation === ANCHOR_RIGHT', () => {
      it('renders .DateRangePicker__picker--direction-right class', () => {
        const wrapper = shallow(<DateRangePicker anchorDirection={ANCHOR_RIGHT} />);
        expect(wrapper.find('.DateRangePicker__picker--direction-right')).to.have.length(1);
      });
    });

    describe('props.withPortal is truthy', () => {
      it('renders .DateRangePicker__picker--portal class', () => {
        const wrapper = shallow(<DateRangePicker withPortal />);
        expect(wrapper.find('.DateRangePicker__picker--portal')).to.have.length(1);
      });

      describe('<Portal />', () => {
        it('is rendered', () => {
          const wrapper = shallow(<DateRangePicker withPortal />);
          expect(wrapper.find(Portal)).to.have.length(1);
        });

        it('isOpened prop is false if props.focusedInput === null', () => {
          const wrapper =
            shallow(<DateRangePicker focusedInput={null} withPortal />);
          expect(wrapper.find(Portal).props().isOpened).to.equal(false);
        });

        it('isOpened prop is true if props.focusedInput !== null', () => {
          const wrapper = shallow(<DateRangePicker withPortal focusedInput={START_DATE} />);
          expect(wrapper.find(Portal).props().isOpened).to.equal(true);
        });
      });
    });

    describe('props.withFullScreenPortal is truthy', () => {
      it('renders .DateRangePicker__picker--portal class', () => {
        const wrapper = shallow(<DateRangePicker withFullScreenPortal />);
        expect(wrapper.find('.DateRangePicker__picker--portal')).to.have.length(1);
      });

      it('renders .DateRangePicker__picker--full-screen-portal class', () => {
        const wrapper = shallow(<DateRangePicker withFullScreenPortal />);
        expect(wrapper.find('.DateRangePicker__picker--full-screen-portal')).to.have.length(1);
      });

      it('renders .DateRangePicker__close class', () => {
        const wrapper = shallow(<DateRangePicker withFullScreenPortal />);
        expect(wrapper.find('.DateRangePicker__close')).to.have.length(1);
      });

      describe('<Portal />', () => {
        it('is rendered', () => {
          const wrapper = shallow(<DateRangePicker withFullScreenPortal />);
          expect(wrapper.find(Portal)).to.have.length(1);
        });

        it('isOpened prop is false if props.focusedInput === null', () => {
          const wrapper =
            shallow(<DateRangePicker focusedInput={null} withFullScreenPortal />);
          expect(wrapper.find(Portal).props().isOpened).to.equal(false);
        });

        it('isOpened prop is true if props.focusedInput !== null', () => {
          const wrapper =
            shallow(<DateRangePicker withFullScreenPortal focusedInput={START_DATE} />);
          expect(wrapper.find(Portal).props().isOpened).to.equal(true);
        });
      });
    });

    describe('props.focusedInput', () => {
      it('shows datepicker if props.focusedInput != null', () => {
        const wrapper = shallow(<DateRangePicker focusedInput={START_DATE} />);
        expect(wrapper.find('.DateRangePicker__picker--show')).to.have.length(1);
      });

      it('hides datepicker if props.focusedInput = null', () => {
        const wrapper = shallow(<DateRangePicker focusedInput={null} />);
        expect(wrapper.find('.DateRangePicker__picker--invisible')).to.have.length(1);
      });
    });
  });

  describe('#clearDates', () => {
    describe('props.reopenPickerOnClearDates is truthy', () => {
      describe('props.onFocusChange', () => {
        it('is called once', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              onFocusChange={onFocusChangeStub}
              reopenPickerOnClearDates
            />);
          wrapper.instance().clearDates();
          expect(onFocusChangeStub.callCount).to.equal(1);
        });

        it('is called with arg START_DATE', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              onFocusChange={onFocusChangeStub}
              reopenPickerOnClearDates
            />);
          wrapper.instance().clearDates();
          expect(onFocusChangeStub.getCall(0).args[0]).to.equal(START_DATE);
        });
      });
    });

    describe('props.reopenPickerOnClearDates is falsy', () => {
      describe('props.onFocusChange', () => {
        it('is not called', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(<DateRangePicker onFocusChange={onFocusChangeStub} />);
          wrapper.instance().clearDates();
          expect(onFocusChangeStub.callCount).to.equal(0);
        });
      });
    });

    it('calls props.onDatesChange with arg { startDate: null, endDate: null }', () => {
      const onDatesChangeStub = sinon.stub();
      const wrapper = shallow(<DateRangePicker onDatesChange={onDatesChangeStub} />);
      wrapper.instance().clearDates();
      expect(onDatesChangeStub.callCount).to.equal(1);
    });
  });

  describe('#onEndDateChange', () => {
    describe('is a valid end date', () => {
      const validFutureDateString = moment(today).add(10, 'days').format('YYYY-MM-DD');
      it('calls props.onDatesChange with correct arguments', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(<DateRangePicker onDatesChange={onDatesChangeStub} />);
        wrapper.instance().onEndDateChange(validFutureDateString);
        expect(onDatesChangeStub.callCount).to.equal(1);

        const onDatesChangeArgs = onDatesChangeStub.getCall(0).args[0];
        expect(onDatesChangeArgs.startDate).to.equal(wrapper.props().startDate);
        expect(isSameDay(onDatesChangeArgs.endDate, moment(validFutureDateString))).to.equal(true);
      });

      describe('props.onFocusChange', () => {
        it('is called once', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(<DateRangePicker onFocusChange={onFocusChangeStub} />);
          wrapper.instance().onEndDateChange(validFutureDateString);
          expect(onFocusChangeStub.callCount).to.equal(1);
        });

        it('is called with null arg', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(<DateRangePicker onFocusChange={onFocusChangeStub} />);
          wrapper.instance().onEndDateChange(validFutureDateString);
          expect(onFocusChangeStub.calledWith(null)).to.equal(true);
        });
      });
    });

    describe('matches custom display format', () => {
      const customFormat = 'MM[foobar]DD';
      const customFormatDateString = moment(today).add(5, 'days').format(customFormat);
      it('calls props.onDatesChange with correct arguments', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            displayFormat={customFormat}
            onDatesChange={onDatesChangeStub}
          />
        );
        wrapper.instance().onEndDateChange(customFormatDateString);
        expect(onDatesChangeStub.callCount).to.equal(1);

        const { startDate, endDate } = onDatesChangeStub.getCall(0).args[0];
        expect(startDate).to.equal(wrapper.instance().props.startDate);
        expect(endDate.format(customFormat)).to.equal(customFormatDateString);
      });

      describe('props.onFocusChange', () => {
        it('is called once', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              displayFormat={customFormat}
              onFocusChange={onFocusChangeStub}
            />
          );
          wrapper.instance().onEndDateChange(customFormatDateString);
          expect(onFocusChangeStub.callCount).to.equal(1);
        });

        it('is called with null arg', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              displayFormat={customFormat}
              onFocusChange={onFocusChangeStub}
            />
          );
          wrapper.instance().onEndDateChange(customFormatDateString);
          expect(onFocusChangeStub.calledWith(null)).to.equal(true);
        });
      });
    });

    describe('is not a valid date string', () => {
      const invalidDateString = 'foo';
      it('calls props.onDatesChange', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(<DateRangePicker onDatesChange={onDatesChangeStub} />);
        wrapper.instance().onEndDateChange(invalidDateString);
        expect(onDatesChangeStub.callCount).to.equal(1);
      });

      it('calls props.onDatesChange with startDate === props.startDate', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={today}
          />
        );
        wrapper.instance().onEndDateChange(invalidDateString);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.startDate).to.equal(today);
      });

      it('calls props.onDatesChange with endDate === null', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(<DateRangePicker onDatesChange={onDatesChangeStub} />);
        wrapper.instance().onEndDateChange(invalidDateString);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.endDate).to.equal(null);
      });
    });

    describe('is outside range', () => {
      const futureDate = moment().add(7, 'day').toISOString();
      const isOutsideRange = day => day >= moment().add(3, 'day');

      it('calls props.onDatesChange', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            isOutsideRange={isOutsideRange}
          />
        );
        wrapper.instance().onEndDateChange(futureDate);
        expect(onDatesChangeStub.callCount).to.equal(1);
      });

      it('calls props.onDatesChange with startDate === props.startDate', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={today}
            isOutsideRange={isOutsideRange}
          />
        );
        wrapper.instance().onEndDateChange(futureDate);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.startDate).to.equal(today);
      });

      it('calls props.onDatesChange with endDate === null', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            isOutsideRange={isOutsideRange}
          />
        );
        wrapper.instance().onEndDateChange(futureDate);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.endDate).to.equal(null);
      });
    });

    describe('is inclusively before state.startDate', () => {
      const startDate = moment(today).add(10, 'days');
      const beforeStartDateString = today.toISOString();
      it('calls props.onDatesChange', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={startDate}
          />
        );
        wrapper.instance().onEndDateChange(beforeStartDateString);
        expect(onDatesChangeStub.callCount).to.equal(1);
      });

      it('calls props.onDatesChange with startDate === props.startDate', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={startDate}
          />
        );
        wrapper.instance().onEndDateChange(beforeStartDateString);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.startDate).to.equal(startDate);
      });

      it('calls props.onDatesChange with endDate === null', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={startDate}
          />
        );
        wrapper.instance().onEndDateChange(beforeStartDateString);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.endDate).to.equal(null);
      });
    });
  });

  describe('#onOutsideClick', () => {
    it('does not call props.onFocusChange if props.focusedInput = null', () => {
      const onFocusChangeStub = sinon.stub();
      const wrapper =
        shallow(<DateRangePicker focusedInput={null} onFocusChange={onFocusChangeStub} />);
      wrapper.instance().onOutsideClick();
      expect(onFocusChangeStub.callCount).to.equal(0);
    });

    it('calls props.onFocusChange if props.focusedInput != null', () => {
      const onFocusChangeStub = sinon.stub();
      const wrapper =
        shallow(<DateRangePicker focusedInput={START_DATE} onFocusChange={onFocusChangeStub} />);
      wrapper.instance().onOutsideClick();
      expect(onFocusChangeStub.callCount).to.equal(1);
    });
  });

  describe('#onStartDateChange', () => {
    describe('is a valid start date', () => {
      const validFutureDateString = moment(today).add(5, 'days').format('YYYY-MM-DD');
      describe('is before props.endDate', () => {
        const endDate = moment(today).add(10, 'days');
        it('calls props.onDatesChange with correct arguments', () => {
          const onDatesChangeStub = sinon.stub();
          const wrapper =
            shallow(<DateRangePicker onDatesChange={onDatesChangeStub} endDate={endDate} />);
          wrapper.instance().onStartDateChange(validFutureDateString);
          expect(onDatesChangeStub.callCount).to.equal(1);

          const onDatesChangeArgs = onDatesChangeStub.getCall(0).args[0];
          const futureDate = moment(validFutureDateString);
          expect(isSameDay(onDatesChangeArgs.startDate, futureDate)).to.equal(true);
          expect(onDatesChangeArgs.endDate).to.equal(endDate);
        });

        describe('props.onFocusChange', () => {
          it('is called once', () => {
            const onFocusChangeStub = sinon.stub();
            const wrapper = shallow(
              <DateRangePicker
                onFocusChange={onFocusChangeStub}
                endDate={endDate}
              />
            );
            wrapper.instance().onStartDateChange(validFutureDateString);
            expect(onFocusChangeStub.callCount).to.equal(1);
          });

          it('is called with END_DATE arg', () => {
            const onFocusChangeStub = sinon.stub();
            const wrapper = shallow(
              <DateRangePicker
                onFocusChange={onFocusChangeStub}
                endDate={endDate}
              />
            );
            wrapper.instance().onStartDateChange(validFutureDateString);
            expect(onFocusChangeStub.calledWith(END_DATE)).to.equal(true);
          });
        });
      });

      describe('is after props.endDate', () => {
        const endDate = moment(today);
        it('calls props.onDatesChange with correct arguments', () => {
          const onDatesChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              onDatesChange={onDatesChangeStub}
              endDate={endDate}
            />
          );
          wrapper.instance().onStartDateChange(validFutureDateString);
          expect(onDatesChangeStub.callCount).to.equal(1);

          const onDatesChangeArgs = onDatesChangeStub.getCall(0).args[0];
          const futureDate = moment(validFutureDateString);
          expect(isSameDay(onDatesChangeArgs.startDate, futureDate)).to.equal(true);
          expect(onDatesChangeArgs.endDate).to.equal(null);
        });

        describe('props.onFocusChange', () => {
          it('is called once', () => {
            const onFocusChangeStub = sinon.stub();
            const wrapper = shallow(
              <DateRangePicker
                onFocusChange={onFocusChangeStub}
                endDate={endDate}
              />
            );
            wrapper.instance().onStartDateChange(validFutureDateString);
            expect(onFocusChangeStub.callCount).to.equal(1);
          });

          it('is called with END_DATE arg', () => {
            const onFocusChangeStub = sinon.stub();
            const wrapper = shallow(
              <DateRangePicker
                onFocusChange={onFocusChangeStub}
                endDate={endDate}
              />
            );
            wrapper.instance().onStartDateChange(validFutureDateString);
            expect(onFocusChangeStub.calledWith(END_DATE)).to.equal(true);
          });
        });
      });
    });

    describe('matches custom display format', () => {
      const customFormat = 'MM[foobar]DD';
      const customFormatDateString = moment(today).add(5, 'days').format(customFormat);
      it('calls props.onDatesChange with correct arguments', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            displayFormat={customFormat}
            onDatesChange={onDatesChangeStub}
          />
        );
        wrapper.instance().onStartDateChange(customFormatDateString);
        expect(onDatesChangeStub.callCount).to.equal(1);

        const { startDate, endDate } = onDatesChangeStub.getCall(0).args[0];
        expect(startDate.format(customFormat)).to.equal(customFormatDateString);
        expect(endDate).to.equal(wrapper.instance().props.endDate);
      });

      describe('props.onFocusChange', () => {
        it('is called once', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              displayFormat={customFormat}
              onFocusChange={onFocusChangeStub}
            />
          );
          wrapper.instance().onStartDateChange(customFormatDateString);
          expect(onFocusChangeStub.callCount).to.equal(1);
        });

        it('is called with END_DATE arg', () => {
          const onFocusChangeStub = sinon.stub();
          const wrapper = shallow(
            <DateRangePicker
              displayFormat={customFormat}
              onFocusChange={onFocusChangeStub}
            />
          );
          wrapper.instance().onStartDateChange(customFormatDateString);
          expect(onFocusChangeStub.calledWith(END_DATE)).to.equal(true);
        });
      });
    });

    describe('is not a valid date string', () => {
      const invalidDateString = 'foo';
      it('calls props.onDatesChange', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(<DateRangePicker onDatesChange={onDatesChangeStub} />);
        wrapper.instance().onStartDateChange(invalidDateString);
        expect(onDatesChangeStub.callCount).to.equal(1);
      });

      it('calls props.onDatesChange with startDate === null', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={today}
          />
        );
        wrapper.instance().onStartDateChange(invalidDateString);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.startDate).to.equal(null);
      });

      it('calls props.onDatesChange with endDate === props.endDate', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper =
          shallow(<DateRangePicker onDatesChange={onDatesChangeStub} endDate={today} />);
        wrapper.instance().onStartDateChange(invalidDateString);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.endDate).to.equal(today);
      });
    });

    describe('is outside range', () => {
      const futureDate = moment().add(7, 'days').toISOString();
      const isOutsideRange = day => day > moment().add(5, 'days');

      it('calls props.onDatesChange', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            isOutsideRange={isOutsideRange}
          />
        );
        wrapper.instance().onStartDateChange(futureDate);
        expect(onDatesChangeStub.callCount).to.equal(1);
      });

      it('calls props.onDatesChange with startDate === null', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            startDate={today}
            isOutsideRange={isOutsideRange}
          />
        );
        wrapper.instance().onStartDateChange(futureDate);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.startDate).to.equal(null);
      });

      it('calls props.onDatesChange with endDate === props.endDate', () => {
        const onDatesChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            onDatesChange={onDatesChangeStub}
            endDate={today}
            isOutsideRange={isOutsideRange}
          />
        );
        wrapper.instance().onStartDateChange(futureDate);
        const args = onDatesChangeStub.getCall(0).args[0];
        expect(args.endDate).to.equal(today);
      });
    });
  });

  describe('#onStartDateFocus', () => {
    it('calls props.onFocusChange once', () => {
      const onFocusChangeStub = sinon.stub();
      const wrapper = shallow(<DateRangePicker onFocusChange={onFocusChangeStub} />);
      wrapper.instance().onStartDateFocus();
      expect(onFocusChangeStub).to.have.property('callCount', 1);
    });

    it('calls props.onFocusChange with START_DATE as arg', () => {
      const onFocusChangeStub = sinon.stub();
      const wrapper = shallow(<DateRangePicker onFocusChange={onFocusChangeStub} />);
      wrapper.instance().onStartDateFocus();
      expect(onFocusChangeStub.getCall(0).args[0]).to.equal(START_DATE);
    });

    describe('props.disabled = true', () => {
      it('does not call props.onFocusChange', () => {
        const onFocusChangeStub = sinon.stub();
        const wrapper = shallow(<DateRangePicker disabled onFocusChange={onFocusChangeStub} />);
        wrapper.instance().onStartDateFocus();
        expect(onFocusChangeStub).to.have.property('callCount', 0);
      });
    });
  });

  describe('#onEndDateFocus', () => {
    it('calls props.onFocusChange once with arg END_DATE', () => {
      const onFocusChangeStub = sinon.stub();
      const wrapper = shallow(<DateRangePicker onFocusChange={onFocusChangeStub} />);
      wrapper.instance().onEndDateFocus();
      expect(onFocusChangeStub).to.have.property('callCount', 1);
      expect(onFocusChangeStub.getCall(0).args[0]).to.equal(END_DATE);
    });

    describe('props.startDate = moment', () => {
      it('calls props.onFocusChange once with arg END_DATE', () => {
        const onFocusChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            startDate={moment(today)}
            onFocusChange={onFocusChangeStub}
          />
        );
        wrapper.instance().onEndDateFocus();
        expect(onFocusChangeStub).to.have.property('callCount', 1);
        expect(onFocusChangeStub.getCall(0).args[0]).to.equal(END_DATE);
      });
    });

    describe('props.withFullScreenPortal is truthy', () => {
      it('calls props.onFocusChange once with arg START_DATE', () => {
        const onFocusChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            withFullScreenPortal
            onFocusChange={onFocusChangeStub}
          />
        );
        wrapper.instance().onEndDateFocus();
        expect(onFocusChangeStub).to.have.property('callCount', 1);
        expect(onFocusChangeStub.getCall(0).args[0]).to.equal(START_DATE);
      });
    });

    describe('props.startDate = moment and props.orientation = VERTICAL_ORIENTATION', () => {
      it('calls props.onFocusChange once with arg END_DATE', () => {
        const onFocusChangeStub = sinon.stub();
        const wrapper = shallow(
          <DateRangePicker
            startDate={moment(today)}
            orientation={VERTICAL_ORIENTATION}
            onFocusChange={onFocusChangeStub}
          />
        );
        wrapper.instance().onEndDateFocus();
        expect(onFocusChangeStub).to.have.property('callCount', 1);
        expect(onFocusChangeStub.getCall(0).args[0]).to.equal(END_DATE);
      });
    });

    describe('props.disabled = true', () => {
      it('does not call props.onFocusChange', () => {
        const onFocusChangeStub = sinon.stub();
        const wrapper = shallow(<DateRangePicker disabled onFocusChange={onFocusChangeStub} />);
        wrapper.instance().onEndDateFocus();
        expect(onFocusChangeStub.callCount).to.equal(0);
      });
    });
  });
});
