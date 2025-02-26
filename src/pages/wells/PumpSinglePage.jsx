import ComponentSkeleton from '@pages/components-overview/ComponentSkeleton';
import MainCard from '@components/MainCard';
import { Chip, Grid, Stack, Typography, Avatar, Box, Divider, Tooltip, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPUMP } from './redux/pumpSlice';
import { useSearchParams } from 'react-router-dom';
import Status from '@components/cards/statistics/StatusMain';
import AlertsTableActive from './components/AlertsActiveTable';
import AlertsTableAll from './components/AlertsAllTable';
import config from '../../config';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PumpHeader from './components/PumpHeader';
import InfoItem from './components/InfoItem';
import TimeAgo from '@pages/counters/components/timeAgo';
import ClearTableModal from './components/modals/clearTableModal';
import UpdateDbModal from './components/modals/updateDbModal';
import WellControllModal from './components/modals/wellControllModal';
import CheckOnline from '@pages/kns/items/CheckOnline';
import Modbus from './components/modbus';
import { resetState } from './redux/modbusSlice';
import EventsAllTable from './components/EventsAllTable';
import WellDisAlertsModal from './components/modals/wellDisAlertsModal';
import SmallWellList from './components/smallWellList';
import NotFound from '@pages/notFound';
import permsCheck from '@pages/authentication/context/permsCheck';
import parseID from '@utils/getObjID';

const PumpSinglePage = () => {
    const dispatch = useDispatch();

    const [slot, setSlot] = useState(4);
    const [updateTime, setUpdateTime] = useState();
    const wellData = useSelector((state) => state.wellModbus);
    const { data, loading, error } = useSelector((state) => state.pump);
    const [firstLoad, setFirstLoad] = useState(false);
    const [searchParams] = useSearchParams();

    const pumpActive = useSelector((state) => state.pumpAlertsActive);
    const [timer, setTimer] = useState(Date.now());
    const glID = searchParams.get('id');
    useEffect(() => {
        dispatch(resetState());
        const interval = setInterval(
            () => setTimer(Date.now()),
            localStorage.apiUpdateTime ? localStorage.apiUpdateTime : config.defaultUpdateTime
        );
        return () => {
            clearInterval(interval);
        };
    }, []);
    useEffect(() => {
        setFirstLoad(false);
    }, [glID]);

    useEffect(() => {
        dispatch(getPUMP(glID));
        setUpdateTime(new Date().toLocaleString());
    }, [timer, glID]);

    useEffect(() => {
        if (loading === 'idle' && wellData?.loading === 'idle') {
            setTimeout(() => setFirstLoad(true), 100);
        }
    }, [loading, wellData?.loading]);

    const { userData } = useSelector((state) => state.user);
    const userAccess = permsCheck(['level_10', 'level_9', 'level_8']);
    const pageAccess = permsCheck(['level_10', 'level_9', 'level_8', 'dash_well_read_all', `dash_well_read_${parseID(glID)}`]);

    return (
        <>
            {pageAccess ? (
                <>
                    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                        <Grid item xs={12} md={12} lg={12} sx={{ mt: 1, mb: 2 }}>
                            <SmallWellList />
                        </Grid>
                    </Grid>

                    <ComponentSkeleton renderContent={firstLoad}>
                        {data?.exist ?? firstLoad ? (
                            <>
                                <PumpHeader
                                    Alarm={data?.alarmStatus}
                                    isOnline={data?.online}
                                    updateDate={data?.timeStamp}
                                    address={data?.address}
                                    pressure={data?.pressure}
                                    id={data?.pumpID}
                                    count={data?.alarmsAmount}
                                />
                                <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                                    <Grid item xs={12} md={5} lg={5} sx={{ mt: 2 }}>
                                        <Typography variant="h5">Загальні дані</Typography>
                                        <InfoItem data={data} />

                                        {userAccess ? (
                                            <>
                                                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                                    Дані Modbus
                                                </Typography>
                                                <MainCard>
                                                    <Modbus data={data} />
                                                </MainCard>
                                            </>
                                        ) : null}
                                    </Grid>
                                    <Grid item xs={12} md={7} lg={7} sx={{ mt: 2 }}>
                                        <Grid item xs={12} md={12} lg={12} sx={{ mb: 2 }}>
                                            <Typography variant="h5">Статус Аварій</Typography>
                                        </Grid>
                                        <Grid container rowSpacing={4.45} columnSpacing={2.75}>
                                            {data?.alarms?.globalAlarm != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Глобальний статус свердловини'}
                                                        text={!data?.alarms?.globalAlarm ? 'В нормі' : 'Виявлено несправності в роботі'}
                                                        status={!data?.alarms?.globalAlarm}
                                                        newDesign={!userAccess}
                                                        extraText={
                                                            !data?.alarms?.globalAlarm
                                                                ? 'Всі системи працюють в штатному режимі'
                                                                : 'Збій систем свердловини'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.voltageAlarm != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Статус електропостачання'}
                                                        text={!data?.alarms?.voltageAlarm ? 'В нормі' : 'Збій електропостачання'}
                                                        status={!data?.alarms?.voltageAlarm}
                                                        newDesign={!userAccess}
                                                        extraText={
                                                            !data?.alarms?.voltageAlarm
                                                                ? 'Енергосистеми працюють в штатному режимі'
                                                                : 'Збій систем електропостачання'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.smoothStartAlarm != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Тиск при старті'}
                                                        newDesign={!userAccess}
                                                        text={!data?.alarms?.smoothStartAlarm ? 'В нормі' : 'Низький тиск'}
                                                        status={!data?.alarms?.smoothStartAlarm}
                                                        extraText={
                                                            !data?.alarms?.smoothStartAlarm
                                                                ? 'Тиск системи в нормі'
                                                                : 'Нізький тиск в системі'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.lowPresAlarm != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Реле низького тиску'}
                                                        newDesign={!userAccess}
                                                        text={!data?.alarms?.lowPresAlarm ? 'В нормі' : 'Реле ввімкнено'}
                                                        status={!data?.alarms?.lowPresAlarm}
                                                        extraText={
                                                            !data?.alarms?.lowPresAlarm ? 'Тиск системи в нормі' : 'Нізький тиск в системі'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.warnings?.conectError != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Зв`язок з ПП'}
                                                        newDesign={!userAccess}
                                                        text={!data?.warnings?.conectError ? 'В нормі' : 'Зв`язок відсутній'}
                                                        status={!data?.warnings?.conectError}
                                                        extraText={
                                                            !data?.warnings?.conectError
                                                                ? 'Проблем не виявлено'
                                                                : 'Виявлено проблему підлючення'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.warnings?.doorIsOpen != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Статус дверей'}
                                                        newDesign={!userAccess}
                                                        text={!data?.warnings?.doorIsOpen ? 'Закриті' : 'Відкриті'}
                                                        status={!data?.warnings?.doorIsOpen}
                                                        extraText={
                                                            !data?.warnings?.doorIsOpen ? 'Вхідні двері зачинено' : 'Вхідні двері відчинено'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.defendAlarm != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Автомат захисту'}
                                                        newDesign={!userAccess}
                                                        text={!data?.alarms?.defendAlarm ? 'В нормі' : 'Автомат захисту ввімкнено'}
                                                        status={!data?.alarms?.defendAlarm}
                                                        extraText={!data?.alarms?.defendAlarm ? ' ' : ' '}
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.warnings?.dryRun != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Рівень - Сухий хід'}
                                                        newDesign={!userAccess}
                                                        text={
                                                            !data?.warnings?.dryRun
                                                                ? 'Вище встановленого значення'
                                                                : 'Нижче встановленого значення'
                                                        }
                                                        status={!data?.warnings?.dryRun}
                                                        extraText={!data?.warnings?.dryRun ? ' ' : ' '}
                                                    />
                                                </Grid>
                                            ) : null}

                                            {data?.alarms?.sensorPressureAlarm != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'Датчик тиску'}
                                                        newDesign={!userAccess}
                                                        text={
                                                            !data?.alarms?.sensorPressureAlarm ? 'В нормі' : 'Виявлено неспавності в роботі'
                                                        }
                                                        status={!data?.alarms?.sensorPressureAlarm}
                                                        extraText={
                                                            !data?.alarms?.sensorPressureAlarm
                                                                ? 'Показник в нормі'
                                                                : 'Не дійсні дані датчика'
                                                        }
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.nullAlarm_NULL_BIT_803 != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'NULL_BIT_803'}
                                                        newDesign={!userAccess}
                                                        text={new String(data?.alarms?.nullAlarm_NULL_BIT_803)}
                                                        status={data?.alarms?.nullAlarm_NULL_BIT_803}
                                                        extraText={'Невідомий біт'}
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.nullAlarm_NULL_BIT_804 != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'NULL_BIT_804'}
                                                        newDesign={!userAccess}
                                                        text={new String(data?.alarms?.nullAlarm_NULL_BIT_804)}
                                                        status={data?.alarms?.nullAlarm_NULL_BIT_804}
                                                        extraText={'Невідомий біт'}
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.nullAlarm_NULL_BIT_805 != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'NULL_BIT_805'}
                                                        newDesign={!userAccess}
                                                        text={new String(data?.alarms?.nullAlarm_NULL_BIT_805)}
                                                        status={data?.alarms?.nullAlarm_NULL_BIT_805}
                                                        extraText={'Невідомий біт'}
                                                    />
                                                </Grid>
                                            ) : null}
                                            {data?.alarms?.nullAlarm_NULL_BIT_809 != null ? (
                                                <Grid item xs={12} md={6} lg={6}>
                                                    <Status
                                                        title={'NULL_BIT_809'}
                                                        newDesign={!userAccess}
                                                        text={new String(data?.alarms?.nullAlarm_NULL_BIT_809)}
                                                        status={data?.alarms?.nullAlarm_NULL_BIT_809}
                                                        extraText={'Невідомий біт'}
                                                    />
                                                </Grid>
                                            ) : null}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 4 }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Typography variant="h5">Управління</Typography>
                                        </Grid>
                                        <Grid item />
                                    </Grid>
                                    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                                        <Grid item xs={12} md={6} xl={3} sm={6} lg={6}>
                                            <WellDisAlertsModal wellID={glID} data={data} />
                                        </Grid>
                                        <Grid item xs={12} md={6} xl={3} sm={6} lg={6}>
                                            <WellControllModal wellID={glID} data={data} />
                                        </Grid>
                                        <Grid item xs={12} md={6} xl={3} sm={6} lg={6}>
                                            <UpdateDbModal wellID={glID} scheme={data?.scheme} data={data} />
                                        </Grid>
                                        <Grid item xs={12} md={6} xl={3} sm={6} lg={6}>
                                            <ClearTableModal wellID={glID} data={data} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} sx={{ mt: 4 }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Typography variant="h5">Події</Typography>
                                        </Grid>
                                        <Grid item />
                                    </Grid>
                                    <MainCard sx={{ mt: 2 }} content={false}>
                                        <EventsAllTable pumpID={glID} />
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} sx={{ mt: 4 }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Typography variant="h5">Активні аварії</Typography>
                                        </Grid>
                                        <Grid item />
                                    </Grid>
                                    <MainCard sx={{ mt: 2 }} content={false}>
                                        <AlertsTableActive pumpID={glID} status={data?.statusOk} />
                                    </MainCard>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} sx={{ mt: 4 }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Typography variant="h5">Список останніх аварій</Typography>
                                        </Grid>
                                        <Grid item />
                                    </Grid>
                                    <MainCard sx={{ mt: 2 }} content={false}>
                                        <AlertsTableAll pumpID={glID} />
                                    </MainCard>
                                </Grid>
                            </>
                        ) : (
                            <NotFound text={'Об`єкт не знайдено.'} subText={'Перевірте налаштування панелі'} />
                        )}
                    </ComponentSkeleton>
                </>
            ) : (
                <NotFound text={'Доступ заборонено'} subText={'Ви не маєте доступу до даної сторінки'} code="400" />
            )}{' '}
        </>
    );
};

export default PumpSinglePage;
