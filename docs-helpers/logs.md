[INFO] Running com.aksi.domain.order.statemachine.OrderWizardStateMachineTest
[ERROR] Tests run: 7, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.047 s <<< FAILURE! -- in com.aksi.domain.order.statemachine.OrderWizardStateMachineTest
[ERROR] com.aksi.domain.order.statemachine.OrderWizardStateMachineTest.shouldValidateCorrectTransitions -- Time elapsed: 0.004 s <<< FAILURE!
org.opentest4j.AssertionFailedError: expected: <true> but was: <false>
	at org.junit.jupiter.api.AssertionFailureBuilder.build(AssertionFailureBuilder.java:151)
	at org.junit.jupiter.api.AssertionFailureBuilder.buildAndThrow(AssertionFailureBuilder.java:132)
	at org.junit.jupiter.api.AssertTrue.failNotTrue(AssertTrue.java:63)
	at org.junit.jupiter.api.AssertTrue.assertTrue(AssertTrue.java:36)
	at org.junit.jupiter.api.AssertTrue.assertTrue(AssertTrue.java:31)
	at org.junit.jupiter.api.Assertions.assertTrue(Assertions.java:183)
	at com.aksi.domain.order.statemachine.OrderWizardStateMachineTest.shouldValidateCorrectTransitions(OrderWizardStateMachineTest.java:38)
	at java.base/java.lang.reflect.Method.invoke(Method.java:580)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1596)

[INFO]
[INFO] Results:
[INFO]
[ERROR] Failures:
[ERROR]   OrderWizardStateMachineTest.shouldValidateCorrectTransitions:38 expected: <true> but was: <false>
[INFO]
[ERROR] Tests run: 7, Failures: 1, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  21.773 s
[INFO] Finished at: 2025-06-10T23:16:37+02:00
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:3.5.3:test (default-test) on project aksi-backend: There are test failures.
[ERROR]
[ERROR] See /home/iddqd/IdeaProjects/Java_Spring_Nextjs_aksi-app/Java_Nextjs_1.0/backend/target/surefire-reports for the individual test results.
[ERROR] See dump files (if any exist) [date].dump, [date]-jvmRun[N].dump and [date].dumpstream.
[ERROR] -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
