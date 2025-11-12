export default {
    methods: {
        getStatusMessage(statusInt) {
            let statusMessage = '';

            switch (statusInt) {
                case 0:
                    statusMessage = 'Good';
                    break;
                case 2:
                    statusMessage = 'GoodCompletesAsynchronously';
                    break;
                case 2048:
                    statusMessage = 'BadServerHalted';
                    break;
                case 2049:
                    statusMessage = 'BadCertificateIssuerRevoked';
                    break;
                case 2051:
                    statusMessage = 'BadNotFound';
                    break;
                case 2052:
                    statusMessage = 'BadNodeNotInView';
                    break;
                case 2053:
                    statusMessage = 'BadNodeIdExists';
                    break;
                case 2054:
                    statusMessage = 'BadQueryTooComplex';
                    break;
                case 2055:
                    statusMessage = 'BadTcpMessageTypeInvalid';
                    break;
                case 2056:
                    statusMessage = 'BadDeadbandFilterInvalid';
                    break;
                case 2057:
                    statusMessage = 'BadDataUnavailable';
                    break;
                case 2064:
                    statusMessage = 'BadLicenseExpired';
                    break;
                case 2949120:
                    statusMessage = 'GoodSubscriptionTransferred';
                    break;
                case 3080192:
                    statusMessage = 'GoodOverload';
                    break;
                case 3145728:
                    statusMessage = 'GoodClamped';
                    break;
                case 9830400:
                    statusMessage = 'GoodLocalOverride';
                    break;
                case 10616832:
                    statusMessage = 'GoodEntryInserted';
                    break;
                case 10682368:
                    statusMessage = 'GoodEntryReplaced';
                    break;
                case 10813440:
                    statusMessage = 'GoodNoData';
                    break;
                case 10878976:
                    statusMessage = 'GoodMoreData';
                    break;
                case 10944512:
                    statusMessage = 'GoodCommunicationEvent';
                    break;
                case 11010048:
                    statusMessage = 'GoodShutdownEvent';
                    break;
                case 11075584:
                    statusMessage = 'GoodCallAgain';
                    break;
                case 11141120:
                    statusMessage = 'GoodNonCriticalTimeout';
                    break;
                case 12189696:
                    statusMessage = 'GoodResultsMayBeIncomplete';
                    break;
                case 14221312:
                    statusMessage = 'GoodDataIgnored';
                    break;
                case 14417920:
                    statusMessage = 'GoodEdited';
                    break;
                case 14483456:
                    statusMessage = 'GoodPostActionFailed';
                    break;
                case 14680064:
                    statusMessage = 'GoodDependentValueChanged';
                    break;
                case 1073741824:
                    statusMessage = 'Uncertain';
                    break;
                case 1080819712:
                    statusMessage = 'UncertainReferenceOutOfServer';
                    break;
                case 1083113472:
                    statusMessage = 'UncertainNoCommunicationLastUsableValue';
                    break;
                case 1083179008:
                    statusMessage = 'UncertainLastUsableValue';
                    break;
                case 1083244544:
                    statusMessage = 'UncertainSubstituteValue';
                    break;
                case 1083310080:
                    statusMessage = 'UncertainInitialValue';
                    break;
                case 1083375616:
                    statusMessage = 'UncertainSensorNotAccurate';
                    break;
                case 1083441152:
                    statusMessage = 'UncertainEngineeringUnitsExceeded';
                    break;
                case 1083506688:
                    statusMessage = 'UncertainSubNormal';
                    break;
                case 1084489728:
                    statusMessage = 'UncertainDataSubNormal';
                    break;
                case 1086062592:
                    statusMessage = 'UncertainReferenceNotDeleted';
                    break;
                case 1086324736:
                    statusMessage = 'UncertainNotAllNodesAvailable';
                    break;
                case 1088290816:
                    statusMessage = 'UncertainDominantValueChanged';
                    break;
                case 1088552960:
                    statusMessage = 'UncertainDependentValueChanged';
                    break;
                case 2147483648:
                    statusMessage = 'Bad';
                    break;
                case 2147549184:
                    statusMessage = 'BadUnexpectedError';
                    break;
                case 2147614720:
                    statusMessage = 'BadInternalError';
                    break;
                case 2147680256:
                    statusMessage = 'BadOutOfMemory';
                    break;
                case 2147745792:
                    statusMessage = 'BadResourceUnavailable';
                    break;
                case 2147811328:
                    statusMessage = 'BadCommunicationError';
                    break;
                case 2147876864:
                    statusMessage = 'BadEncodingError';
                    break;
                case 2147942400:
                    statusMessage = 'BadDecodingError';
                    break;
                case 2148007936:
                    statusMessage = 'BadEncodingLimitsExceeded';
                    break;
                case 2148073472:
                    statusMessage = 'BadUnknownResponse';
                    break;
                case 2148139008:
                    statusMessage = 'BadTimeout';
                    break;
                case 2148204544:
                    statusMessage = 'BadServiceUnsupported';
                    break;
                case 2148270080:
                    statusMessage = 'BadShutdown';
                    break;
                case 2148335616:
                    statusMessage = 'BadServerNotConnected';
                    break;
                case 2148466688:
                    statusMessage = 'BadNothingToDo';
                    break;
                case 2148532224:
                    statusMessage = 'BadTooManyOperations';
                    break;
                case 2148597760:
                    statusMessage = 'BadDataTypeIdUnknown';
                    break;
                case 2148663296:
                    statusMessage = 'BadCertificateInvalid';
                    break;
                case 2148728832:
                    statusMessage = 'BadSecurityChecksFailed';
                    break;
                case 2148794368:
                    statusMessage = 'BadCertificateTimeInvalid';
                    break;
                case 2148859904:
                    statusMessage = 'BadCertificateIssuerTimeInvalid';
                    break;
                case 2148925440:
                    statusMessage = 'BadCertificateHostNameInvalid';
                    break;
                case 2148990976:
                    statusMessage = 'BadCertificateUriInvalid';
                    break;
                case 2149056512:
                    statusMessage = 'BadCertificateUseNotAllowed';
                    break;
                case 2149122048:
                    statusMessage = 'BadCertificateIssuerUseNotAllowed';
                    break;
                case 2149187584:
                    statusMessage = 'BadCertificateUntrusted';
                    break;
                case 2149253120:
                    statusMessage = 'BadCertificateRevocationUnknown';
                    break;
                case 2149318656:
                    statusMessage = 'BadCertificateIssuerRevocationUnknown';
                    break;
                case 2149384192:
                    statusMessage = 'BadCertificateRevoked';
                    break;
                case 2149515264:
                    statusMessage = 'BadUserAccessDenied';
                    break;
                case 2149580800:
                    statusMessage = 'BadIdentityTokenInvalid';
                    break;
                case 2149646336:
                    statusMessage = 'BadIdentityTokenRejected';
                    break;
                case 2149711872:
                    statusMessage = 'BadSecureChannelIdInvalid';
                    break;
                case 2149777408:
                    statusMessage = 'BadInvalidTimestamp';
                    break;
                case 2149842944:
                    statusMessage = 'BadNonceInvalid';
                    break;
                case 2149908480:
                    statusMessage = 'BadSessionIdInvalid';
                    break;
                case 2149974016:
                    statusMessage = 'BadSessionClosed';
                    break;
                case 2150039552:
                    statusMessage = 'BadSessionNotActivated';
                    break;
                case 2150105088:
                    statusMessage = 'BadSubscriptionIdInvalid';
                    break;
                case 2150236160:
                    statusMessage = 'BadRequestHeaderInvalid';
                    break;
                case 2150301696:
                    statusMessage = 'BadTimestampsToReturnInvalid';
                    break;
                case 2150367232:
                    statusMessage = 'BadRequestCancelledByClient';
                    break;
                case 2150694912:
                    statusMessage = 'BadNoCommunication';
                    break;
                case 2150760448:
                    statusMessage = 'BadWaitingForInitialData';
                    break;
                case 2150825984:
                    statusMessage = 'BadNodeIdInvalid';
                    break;
                case 2150891520:
                    statusMessage = 'BadNodeIdUnknown';
                    break;
                case 2150957056:
                    statusMessage = 'BadAttributeIdInvalid';
                    break;
                case 2151022592:
                    statusMessage = 'BadIndexRangeInvalid';
                    break;
                case 2151088128:
                    statusMessage = 'BadIndexRangeNoData';
                    break;
                case 2151153664:
                    statusMessage = 'BadDataEncodingInvalid';
                    break;
                case 2151219200:
                    statusMessage = 'BadDataEncodingUnsupported';
                    break;
                case 2151284736:
                    statusMessage = 'BadNotReadable';
                    break;
                case 2151350272:
                    statusMessage = 'BadNotWritable';
                    break;
                case 2151415808:
                    statusMessage = 'BadOutOfRange';
                    break;
                case 2151481344:
                    statusMessage = 'BadNotSupported';
                    break;
                case 2151612416:
                    statusMessage = 'BadObjectDeleted';
                    break;
                case 2151677952:
                    statusMessage = 'BadNotImplemented';
                    break;
                case 2151743488:
                    statusMessage = 'BadMonitoringModeInvalid';
                    break;
                case 2151809024:
                    statusMessage = 'BadMonitoredItemIdInvalid';
                    break;
                case 2151874560:
                    statusMessage = 'BadMonitoredItemFilterInvalid';
                    break;
                case 2151940096:
                    statusMessage = 'BadMonitoredItemFilterUnsupported';
                    break;
                case 2152005632:
                    statusMessage = 'BadFilterNotAllowed';
                    break;
                case 2152071168:
                    statusMessage = 'BadStructureMissing';
                    break;
                case 2152136704:
                    statusMessage = 'BadEventFilterInvalid';
                    break;
                case 2152202240:
                    statusMessage = 'BadContentFilterInvalid';
                    break;
                case 2152267776:
                    statusMessage = 'BadFilterOperandInvalid';
                    break;
                case 2152333312:
                    statusMessage = 'BadContinuationPointInvalid';
                    break;
                case 2152398848:
                    statusMessage = 'BadNoContinuationPoints';
                    break;
                case 2152464384:
                    statusMessage = 'BadReferenceTypeIdInvalid';
                    break;
                case 2152529920:
                    statusMessage = 'BadBrowseDirectionInvalid';
                    break;
                case 2152660992:
                    statusMessage = 'BadServerUriInvalid';
                    break;
                case 2152726528:
                    statusMessage = 'BadServerNameMissing';
                    break;
                case 2152792064:
                    statusMessage = 'BadDiscoveryUrlMissing';
                    break;
                case 2152857600:
                    statusMessage = 'BadSempahoreFileMissing';
                    break;
                case 2152923136:
                    statusMessage = 'BadRequestTypeInvalid';
                    break;
                case 2152988672:
                    statusMessage = 'BadSecurityModeRejected';
                    break;
                case 2153054208:
                    statusMessage = 'BadSecurityPolicyRejected';
                    break;
                case 2153119744:
                    statusMessage = 'BadTooManySessions';
                    break;
                case 2153185280:
                    statusMessage = 'BadUserSignatureInvalid';
                    break;
                case 2153250816:
                    statusMessage = 'BadApplicationSignatureInvalid';
                    break;
                case 2153316352:
                    statusMessage = 'BadNoValidCertificates';
                    break;
                case 2153381888:
                    statusMessage = 'BadRequestCancelledByRequest';
                    break;
                case 2153447424:
                    statusMessage = 'BadParentNodeIdInvalid';
                    break;
                case 2153512960:
                    statusMessage = 'BadReferenceNotAllowed';
                    break;
                case 2153578496:
                    statusMessage = 'BadNodeIdRejected';
                    break;
                case 2153709568:
                    statusMessage = 'BadNodeClassInvalid';
                    break;
                case 2153775104:
                    statusMessage = 'BadBrowseNameInvalid';
                    break;
                case 2153840640:
                    statusMessage = 'BadBrowseNameDuplicated';
                    break;
                case 2153906176:
                    statusMessage = 'BadNodeAttributesInvalid';
                    break;
                case 2153971712:
                    statusMessage = 'BadTypeDefinitionInvalid';
                    break;
                case 2154037248:
                    statusMessage = 'BadSourceNodeIdInvalid';
                    break;
                case 2154102784:
                    statusMessage = 'BadTargetNodeIdInvalid';
                    break;
                case 2154168320:
                    statusMessage = 'BadDuplicateReferenceNotAllowed';
                    break;
                case 2154233856:
                    statusMessage = 'BadInvalidSelfReference';
                    break;
                case 2154299392:
                    statusMessage = 'BadReferenceLocalOnly';
                    break;
                case 2154364928:
                    statusMessage = 'BadNoDeleteRights';
                    break;
                case 2154430464:
                    statusMessage = 'BadServerIndexInvalid';
                    break;
                case 2154496000:
                    statusMessage = 'BadViewIdUnknown';
                    break;
                case 2154627072:
                    statusMessage = 'BadTooManyMatches';
                    break;
                case 2154758144:
                    statusMessage = 'BadNoMatch';
                    break;
                case 2154823680:
                    statusMessage = 'BadMaxAgeInvalid';
                    break;
                case 2154889216:
                    statusMessage = 'BadHistoryOperationInvalid';
                    break;
                case 2154954752:
                    statusMessage = 'BadHistoryOperationUnsupported';
                    break;
                case 2155020288:
                    statusMessage = 'BadWriteNotSupported';
                    break;
                case 2155085824:
                    statusMessage = 'BadTypeMismatch';
                    break;
                case 2155151360:
                    statusMessage = 'BadMethodInvalid';
                    break;
                case 2155216896:
                    statusMessage = 'BadArgumentsMissing';
                    break;
                case 2155282432:
                    statusMessage = 'BadTooManySubscriptions';
                    break;
                case 2155347968:
                    statusMessage = 'BadTooManyPublishRequests';
                    break;
                case 2155413504:
                    statusMessage = 'BadNoSubscription';
                    break;
                case 2155479040:
                    statusMessage = 'BadSequenceNumberUnknown';
                    break;
                case 2155544576:
                    statusMessage = 'BadMessageNotAvailable';
                    break;
                case 2155610112:
                    statusMessage = 'BadInsufficientClientProfile';
                    break;
                case 2155675648:
                    statusMessage = 'BadTcpServerTooBusy';
                    break;
                case 2155806720:
                    statusMessage = 'BadTcpSecureChannelUnknown';
                    break;
                case 2155872256:
                    statusMessage = 'BadTcpMessageTooLarge';
                    break;
                case 2155937792:
                    statusMessage = 'BadTcpNotEnoughResources';
                    break;
                case 2156003328:
                    statusMessage = 'BadTcpInternalError';
                    break;
                case 2156068864:
                    statusMessage = 'BadTcpEndpointUrlInvalid';
                    break;
                case 2156134400:
                    statusMessage = 'BadRequestInterrupted';
                    break;
                case 2156199936:
                    statusMessage = 'BadRequestTimeout';
                    break;
                case 2156265472:
                    statusMessage = 'BadSecureChannelClosed';
                    break;
                case 2156331008:
                    statusMessage = 'BadSecureChannelTokenUnknown';
                    break;
                case 2156396544:
                    statusMessage = 'BadSequenceNumberInvalid';
                    break;
                case 2156462080:
                    statusMessage = 'BadConfigurationError';
                    break;
                case 2156527616:
                    statusMessage = 'BadNotConnected';
                    break;
                case 2156593152:
                    statusMessage = 'BadDeviceFailure';
                    break;
                case 2156658688:
                    statusMessage = 'BadSensorFailure';
                    break;
                case 2156724224:
                    statusMessage = 'BadOutOfService';
                    break;
                case 2157379584:
                    statusMessage = 'BadRefreshInProgress';
                    break;
                case 2157445120:
                    statusMessage = 'BadConditionAlreadyDisabled';
                    break;
                case 2157510656:
                    statusMessage = 'BadConditionDisabled';
                    break;
                case 2157576192:
                    statusMessage = 'BadEventIdUnknown';
                    break;
                case 2157641728:
                    statusMessage = 'BadNoData';
                    break;
                case 2157772800:
                    statusMessage = 'BadDataLost';
                    break;
                case 2157903872:
                    statusMessage = 'BadEntryExists';
                    break;
                case 2157969408:
                    statusMessage = 'BadNoEntryExists';
                    break;
                case 2158034944:
                    statusMessage = 'BadTimestampNotSupported';
                    break;
                case 2158690304:
                    statusMessage = 'BadInvalidArgument';
                    break;
                case 2158755840:
                    statusMessage = 'BadConnectionRejected';
                    break;
                case 2158821376:
                    statusMessage = 'BadDisconnect';
                    break;
                case 2158886912:
                    statusMessage = 'BadConnectionClosed';
                    break;
                case 2158952448:
                    statusMessage = 'BadInvalidState';
                    break;
                case 2159017984:
                    statusMessage = 'BadEndOfStream';
                    break;
                case 2159083520:
                    statusMessage = 'BadNoDataAvailable';
                    break;
                case 2159149056:
                    statusMessage = 'BadWaitingForResponse';
                    break;
                case 2159214592:
                    statusMessage = 'BadOperationAbandoned';
                    break;
                case 2159280128:
                    statusMessage = 'BadExpectedStreamToBlock';
                    break;
                case 2159345664:
                    statusMessage = 'BadWouldBlock';
                    break;
                case 2159411200:
                    statusMessage = 'BadSyntaxError';
                    break;
                case 2159476736:
                    statusMessage = 'BadMaxConnectionsReached';
                    break;
                case 2159542272:
                    statusMessage = 'BadRequestTooLarge';
                    break;
                case 2159607808:
                    statusMessage = 'BadResponseTooLarge';
                    break;
                case 2159738880:
                    statusMessage = 'BadEventNotAcknowledgeable';
                    break;
                case 2159869952:
                    statusMessage = 'BadInvalidTimestampArgument';
                    break;
                case 2159935488:
                    statusMessage = 'BadProtocolVersionUnsupported';
                    break;
                case 2160001024:
                    statusMessage = 'BadStateNotActive';
                    break;
                case 2160132096:
                    statusMessage = 'BadFilterOperatorInvalid';
                    break;
                case 2160197632:
                    statusMessage = 'BadFilterOperatorUnsupported';
                    break;
                case 2160263168:
                    statusMessage = 'BadFilterOperandCountMismatch';
                    break;
                case 2160328704:
                    statusMessage = 'BadFilterElementInvalid';
                    break;
                case 2160394240:
                    statusMessage = 'BadFilterLiteralInvalid';
                    break;
                case 2160459776:
                    statusMessage = 'BadIdentityChangeNotSupported';
                    break;
                case 2160590848:
                    statusMessage = 'BadNotTypeDefinition';
                    break;
                case 2160656384:
                    statusMessage = 'BadViewTimestampInvalid';
                    break;
                case 2160721920:
                    statusMessage = 'BadViewParameterMismatch';
                    break;
                case 2160787456:
                    statusMessage = 'BadViewVersionInvalid';
                    break;
                case 2160852992:
                    statusMessage = 'BadConditionAlreadyEnabled';
                    break;
                case 2160918528:
                    statusMessage = 'BadDialogNotActive';
                    break;
                case 2160984064:
                    statusMessage = 'BadDialogResponseInvalid';
                    break;
                case 2161049600:
                    statusMessage = 'BadConditionBranchAlreadyAcked';
                    break;
                case 2161115136:
                    statusMessage = 'BadConditionBranchAlreadyConfirmed';
                    break;
                case 2161180672:
                    statusMessage = 'BadConditionAlreadyShelved';
                    break;
                case 2161246208:
                    statusMessage = 'BadConditionNotShelved';
                    break;
                case 2161311744:
                    statusMessage = 'BadShelvingTimeOutOfRange';
                    break;
                case 2161377280:
                    statusMessage = 'BadAggregateListMismatch';
                    break;
                case 2161442816:
                    statusMessage = 'BadAggregateNotSupported';
                    break;
                case 2161508352:
                    statusMessage = 'BadAggregateInvalidInputs';
                    break;
                case 2161573888:
                    statusMessage = 'BadBoundNotFound';
                    break;
                case 2161639424:
                    statusMessage = 'BadBoundNotSupported';
                    break;
                case 2161770496:
                    statusMessage = 'BadAggregateConfigurationRejected';
                    break;
                case 2161836032:
                    statusMessage = 'BadTooManyMonitoredItems';
                    break;
                case 2162229248:
                    statusMessage = 'BadDominantValueChanged';
                    break;
                case 2162360320:
                    statusMessage = 'BadDependentValueChanged';
                    break;
                case 2162425856:
                    statusMessage = 'BadRequestNotAllowed';
                    break;
                case 2162491392:
                    statusMessage = 'BadTooManyArguments';
                    break;
                case 2162556928:
                    statusMessage = 'BadSecurityModeInsufficient';
                    break;
                case 2165112832:
                    statusMessage = 'BadCertificateChainIncomplete';
                    break;
                case 2165243904:
                    statusMessage = 'BadLicenseLimitsExceeded';
                    break;
                case 2165309440:
                    statusMessage = 'BadLicenseNotAvailable';
                    break;
                case 2165374976:
                    statusMessage = 'BadNotExecutable';
                    break;
                case 2165440512:
                    statusMessage = 'BadNumericOverflow';
                    break;
                case 2165506048:
                    statusMessage = 'BadRequestNotComplete';
                    break;
                case 2165571584:
                    statusMessage = 'BadCertificatePolicyCheckFailed';
                    break;
                case 2165637120:
                    statusMessage = 'BadAlreadyExists';
                    break;
                default:
                    statusMessage = 'Unknown error';
                    break;

            }
            return statusMessage;
        }
    }
};